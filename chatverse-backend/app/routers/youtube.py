import uuid
import re
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from youtube_transcript_api import YouTubeTranscriptApi
from langchain_core.documents import Document

from app.schemas import IngestResponse, ChatRequest, ChatResponse, SourceChunk
from app.core.vectorstore import get_vectorstore
from app.graphs.youtube_graph import youtube_graph

router = APIRouter()
_history: dict[str, list[dict]] = {}


class YouTubeIngestRequest(BaseModel):
    url: str


def extract_video_id(url: str) -> str:
    match = re.search(r"(?:v=|youtu\.be/)([A-Za-z0-9_-]{11})", url)
    if not match:
        raise HTTPException(400, "Could not extract video ID from URL")
    return match.group(1)


def chunk_transcript(transcript: list[dict], window_seconds: int = 60) -> list[Document]:
    """Group transcript segments into ~60-second windows, each a Document
    with a start_time in metadata."""
    chunks = []
    current_text = []
    window_start = 0.0

    for seg in transcript:
        if seg["start"] - window_start > window_seconds and current_text:
            chunks.append(Document(
                page_content=" ".join(current_text),
                metadata={"start_time": round(window_start, 1)},
            ))
            current_text = []
            window_start = seg["start"]
        current_text.append(seg["text"])

    if current_text:
        chunks.append(Document(
            page_content=" ".join(current_text),
            metadata={"start_time": round(window_start, 1)},
        ))
    return chunks


@router.post("/ingest", response_model=IngestResponse)
async def ingest_youtube(req: YouTubeIngestRequest):
    video_id = extract_video_id(req.url)

    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
    except Exception as e:
        raise HTTPException(400, f"Could not fetch transcript: {e}")

    chunks = chunk_transcript(transcript)

    session_id = str(uuid.uuid4())
    vs = get_vectorstore("youtube", session_id)
    vs.add_documents(chunks)
    _history[session_id] = []

    return IngestResponse(
        session_id=session_id,
        status="success",
        chunks_indexed=len(chunks),
    )


@router.post("/chat", response_model=ChatResponse)
async def chat_youtube(req: ChatRequest):
    if req.session_id not in _history:
        raise HTTPException(404, "Unknown session_id — ingest a video first")

    result = youtube_graph.invoke({
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