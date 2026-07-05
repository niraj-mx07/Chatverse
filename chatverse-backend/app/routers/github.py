
# TODO: implement GitHub endpoints

import uuid
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from github import Github
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

from app.config import settings
from app.schemas import IngestResponse, ChatRequest, ChatResponse, SourceChunk
from app.core.vectorstore import get_vectorstore
from app.graphs.github_graph import github_graph

router = APIRouter()
_history: dict[str, list[dict]] = {}

CODE_EXTENSIONS = {".py", ".js", ".jsx", ".ts", ".tsx", ".md", ".java", ".go", ".rs"}
MAX_FILE_SIZE = 100_000  # bytes, skip huge generated/binary-ish files


class GitHubIngestRequest(BaseModel):
    repo_url: str  # e.g. "owner/repo" or full github.com URL


def parse_repo_name(repo_url: str) -> str:
    if "github.com" in repo_url:
        parts = repo_url.rstrip("/").split("github.com/")[-1]
        return parts
    return repo_url


def fetch_repo_documents(repo_name: str) -> list[Document]:
    gh = Github(settings.github_token) if settings.github_token else Github()
    repo = gh.get_repo(repo_name)

    docs = []
    contents = repo.get_contents("")
    while contents:
        item = contents.pop(0)
        if item.type == "dir":
            contents.extend(repo.get_contents(item.path))
            continue

        ext = "." + item.name.split(".")[-1] if "." in item.name else ""
        if ext not in CODE_EXTENSIONS or item.size > MAX_FILE_SIZE:
            continue

        try:
            text = item.decoded_content.decode("utf-8")
        except (UnicodeDecodeError, AttributeError):
            continue

        docs.append(Document(page_content=text, metadata={"source": item.path}))

    return docs


@router.post("/ingest", response_model=IngestResponse)
async def ingest_github(req: GitHubIngestRequest):
    repo_name = parse_repo_name(req.repo_url)

    try:
        docs = fetch_repo_documents(repo_name)
    except Exception as e:
        raise HTTPException(400, f"Could not fetch repo: {e}")

    if not docs:
        raise HTTPException(400, "No readable source files found in repo")

    splitter = RecursiveCharacterTextSplitter(chunk_size=1200, chunk_overlap=200)
    chunks = splitter.split_documents(docs)

    session_id = str(uuid.uuid4())
    vs = get_vectorstore("github", session_id)
    vs.add_documents(chunks)
    _history[session_id] = []

    return IngestResponse(session_id=session_id, status="success", chunks_indexed=len(chunks))


@router.post("/chat", response_model=ChatResponse)
async def chat_github(req: ChatRequest):
    if req.session_id not in _history:
        raise HTTPException(404, "Unknown session_id — ingest a repo first")

    result = github_graph.invoke({
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