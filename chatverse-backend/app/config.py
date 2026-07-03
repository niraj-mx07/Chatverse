from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from .env file."""

    # LLM API keys (use one or both)
    OPENAI_API_KEY: Optional[str] = None
    GOOGLE_API_KEY: Optional[str] = None

    # ChromaDB persistence directory
    CHROMA_PERSIST_DIR: str = "./chroma_db"

    # GitHub integration
    GITHUB_TOKEN: Optional[str] = None

    # Gmail integration — path to OAuth credentials JSON
    GMAIL_CREDENTIALS_PATH: Optional[str] = None

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
    }


settings = Settings()
