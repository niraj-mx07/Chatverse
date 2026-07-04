from typing import Optional
from pydantic import BaseModel


class IngestResponse(BaseModel):
    session_id: str
    status: str          # "success" | "error"
    chunks_indexed: int
    message: Optional[str] = None


class ChatRequest(BaseModel):
    session_id: str
    message: str


class SourceChunk(BaseModel):
    content: str
    metadata: dict


class ChatResponse(BaseModel):
    answer: str
    sources: list[SourceChunk]
    session_id: str


class HistoryTurn(BaseModel):
    role: str             # "user" | "assistant"
    content: str


class HistoryResponse(BaseModel):
    session_id: str
    history: list[HistoryTurn]