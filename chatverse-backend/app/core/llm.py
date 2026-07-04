from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from app.config import settings


def get_llm(temperature: float = 0.2) -> ChatOpenAI:
    return ChatOpenAI(
        model="gpt-4o-mini",
        temperature=temperature,
        api_key=settings.openai_api_key,
    )


def get_embeddings() -> OpenAIEmbeddings:
    return OpenAIEmbeddings(
        model="text-embedding-3-small",
        api_key=settings.openai_api_key,
    )