import uuid
import shutil
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.schemas import IngestResponse, ChatRequest, ChatResponse, SourceChunk
from app.core.vectorstore import get_vectorstore
from app.graphs.pdf_graph import pdf_graph

router = APIRouter()

UPLOAD_DIR = Path("./uploads/pdf")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# in-memory chat history keyed by session_id — swap for Redis/DB in production
_history: dict[str, list[dict]] = {}


@router.post("/ingest", response_model=IngestResponse)
async def ingest_pdf(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(400, "Only PDF files are accepted")

    session_id = str(uuid.uuid4())
    dest_path = UPLOAD_DIR / f"{session_id}.pdf"

    with dest_path.open("wb") as f:
        shutil.copyfileobj(file.file, f)

    loader = PyPDFLoader(str(dest_path))
    pages = loader.load()

    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150)
    chunks = splitter.split_documents(pages)

    vs = get_vectorstore("pdf", session_id)
    vs.add_documents(chunks)

    _history[session_id] = []

    return IngestResponse(
        session_id=session_id,
        status="success",
        chunks_indexed=len(chunks),
    )


@router.post("/chat", response_model=ChatResponse)
async def chat_pdf(req: ChatRequest):
    if req.session_id not in _history:
        raise HTTPException(404, "Unknown session_id — ingest a PDF first")

    result = pdf_graph.invoke({
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

    return ChatResponse(
        answer=result["answer"],
        sources=sources,
        session_id=req.session_id,
    )


@router.get("/sessions/{session_id}")
async def get_history(session_id: str):
    if session_id not in _history:
        raise HTTPException(404, "Unknown session_id")
    return {"session_id": session_id, "history": _history[session_id]}