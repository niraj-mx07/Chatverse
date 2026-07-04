import chromadb
from langchain_chroma import chroma
from app.config import settings
from app.core.llm import get_embeddings

_client = chromadb.PersistentClient(path=settings.chroma_persist_dir)

def get_vectorstore(mode: str, session_id: str) -> Chroma:
    collection_name = f"{mode}_{session_id}"
    return Chroma(
        client = _client,
        collection_name = collection_name,
        embedding_function = get_embeddings(),
    )