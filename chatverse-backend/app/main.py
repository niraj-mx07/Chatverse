from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings 
from app.routers import pdf, youtube, github, gmail

app = FastAPI(title="ChatVerse API")

# CORS — allow the Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers with /api/{mode} prefix
app.include_router(pdf.router, prefix="/api/pdf", tags=["PDF"])
app.include_router(youtube.router, prefix="/api/youtube", tags=["YouTube"])
app.include_router(github.router, prefix="/api/github", tags=["GitHub"])
app.include_router(gmail.router, prefix="/api/gmail", tags=["Gmail"])


@app.get("/")
async def health():
    return {"message": "ChatVerse Backend is running"}
