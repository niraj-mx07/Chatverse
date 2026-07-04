from pydantic_settings import BaseSettings

class Settings(BaseSettings):

    openai_api_key: str = ""
    chroma_persist_dir: str ="./.chroma_db"
    github_token: str = ""
    gmail_credentials_path: str = "./credentials.json"
    cors_origins: str = "http://localhost:5173"

    class Config:
        env_file = ".env"


settings = Settings()