from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import pdf, youtube, github, gmail

app = FastAPI(title="ChatVerse API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pdf.router, prefix="/api/pdf", tags=["pdf"])
app.include_router(youtube.router, prefix="/api/youtube", tags=["youtube"])
app.include_router(github.router, prefix="/api/github", tags=["github"])
app.include_router(gmail.router, prefix="/api/gmail", tags=["gmail"])


@app.get("/health")
async def health():
    return {"status": "ok"}