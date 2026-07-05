
# TODO: implement Gmail endpoints

import uuid
import base64
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from googleapiclient.discovery import build

from app.schemas import IngestResponse, ChatRequest, ChatResponse, SourceChunk
from app.core.vectorstore import get_vectorstore
from app.core.gmail_auth import get_gmail_credentials
from app.graphs.gmail_graph import gmail_graph
from langchain_core.documents import Document

router = APIRouter()
_history: dict[str, list[dict]] = {}


class GmailIngestRequest(BaseModel):
    query: str = ""       # Gmail search syntax, e.g. "from:someone@x.com"
    max_results: int = 25


def extract_plain_text(payload: dict) -> str:
    if payload.get("mimeType") == "text/plain" and "data" in payload.get("body", {}):
        return base64.urlsafe_b64decode(payload["body"]["data"]).decode("utf-8", "ignore")

    for part in payload.get("parts", []):
        text = extract_plain_text(part)
        if text:
            return text
    return ""


@router.post("/ingest", response_model=IngestResponse)
async def ingest_gmail(req: GmailIngestRequest):
    creds = get_gmail_credentials()
    service = build("gmail", "v1", credentials=creds)

    results = service.users().messages().list(
        userId="me", q=req.query, maxResults=req.max_results
    ).execute()
    message_refs = results.get("messages", [])

    docs = []
    for ref in message_refs:
        msg = service.users().messages().get(userId="me", id=ref["id"], format="full").execute()
        headers = {h["name"]: h["value"] for h in msg["payload"].get("headers", [])}
        body = extract_plain_text(msg["payload"])

        docs.append(Document(
            page_content=f"Subject: {headers.get('Subject', '')}\n\n{body}",
            metadata={
                "from": headers.get("From", ""),
                "date": headers.get("Date", ""),
                "subject": headers.get("Subject", ""),
            },
        ))

    if not docs:
        raise HTTPException(400, "No emails found matching that query")

    session_id = str(uuid.uuid4())
    vs = get_vectorstore("gmail", session_id)
    vs.add_documents(docs)
    _history[session_id] = []

    return IngestResponse(session_id=session_id, status="success", chunks_indexed=len(docs))


@router.post("/chat", response_model=ChatResponse)
async def chat_gmail(req: ChatRequest):
    if req.session_id not in _history:
        raise HTTPException(404, "Unknown session_id — ingest emails first")

    result = gmail_graph.invoke({
        "session_id": req.session_id,
        "question": req.message,
        "context_docs": [],
        "answer": "",
    })

    _history[req.session_id].append({"role": "user", "content": req.message})
    _history[req.session_id].append({"role": "assistant", "content": result["answer"]})

    sources = [
        SourceChunk(content=d.page_content[:300], metadata=d.metadata)
        for d in result["context_docs"]
    ]
    return ChatResponse(answer=result["answer"], sources=sources, session_id=req.session_id)


@router.get("/sessions/{session_id}")
async def get_history(session_id: str):
    if session_id not in _history:
        raise HTTPException(404, "Unknown session_id")
    return {"session_id": session_id, "history": _history[session_id]}