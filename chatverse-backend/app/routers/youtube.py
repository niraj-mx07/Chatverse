
# TODO: implement YouTube endpoints

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
_history: duct[str , list[dict]] = {}

class YouTubeIngestRequest(BaseModel):
    url: str

    