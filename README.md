# ChatVerse - Multi-Mode RAG Chat Platform

[![Python 3.12+](https://img.shields.io/badge/Python-3.12+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green.svg)](https://fastapi.tiangolo.com/)
[![LangGraph](https://img.shields.io/badge/LangGraph-0.2.39-orange.svg)](https://python.langchain.com/langgraph/)
[![ChromaDB](https://img.shields.io/badge/ChromaDB-VectorDB-purple.svg)](https://www.trychroma.com/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://react.dev/)

## 📋 Overview

**ChatVerse** is a multi-mode Retrieval-Augmented Generation (RAG) platform that lets you chat with four different kinds of sources — **PDFs**, **YouTube videos**, **GitHub repositories**, and **Gmail inboxes** — through one unified interface.

Every mode shares the same underlying pattern: ingest a source, chunk and embed it into an isolated vector collection, then retrieve and generate answers through a LangGraph pipeline. Only the ingestion step changes per source — everything else is identical, which keeps the system small and easy to reason about instead of four separate apps bolted together.

---

## 🎯 Key Features

### 📄 Chat with PDF
- **Page-Aware Chunking**: Documents are split with `RecursiveCharacterTextSplitter`, preserving page metadata
- **Grounded Answers**: Every reply is generated only from retrieved chunks — no answer without a citation

### ▶️ Chat with YouTube
- **Transcript Retrieval**: Pulls captions via `youtube-transcript-api`, no API key required
- **Timestamp Windows**: Transcript segments are grouped into ~60s windows so answers can point to `t=6:40`

### ⌥ Chat with GitHub
- **Repo Walking**: Uses `PyGithub` to list and read source files without a local `git clone`
- **File-Path Citations**: Answers reference the exact file a chunk came from

### ✉️ Chat with Gmail
- **OAuth2 Flow**: One-time browser consent, cached and auto-refreshed via `google-auth-oauthlib`
- **Plain-Language Search**: Ask about your inbox instead of guessing the right search operators

### 🧠 Shared RAG Core
- **LangGraph Pipelines**: Every mode is a `StateGraph` with `retrieve` → `generate` nodes
- **Isolated Vector Storage**: Chroma collections scoped per `mode + session_id`
- **Uniform API Contract**: All four modes expose identical `/ingest`, `/chat`, `/sessions/{id}` shapes

### 🎨 Frontend
- **Landing Page**: Marketing site with a live mode-switching demo
- **Dashboard**: Dark, sidebar-driven chat UI — pick a source, ingest, and chat
- **React Router**: `/` for the landing page, `/app` for the dashboard

---

## 🏗️ Architecture

### System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      React Frontend (Vite)                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  LandingPage.jsx  →  HomePage.jsx (Sidebar + Chat)        │  │
│  │  • Mode selection (PDF / YouTube / GitHub / Gmail)        │  │
│  │  • Source ingestion UI                                    │  │
│  │  • Chat window + source citations                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            ↓ axios (client.js)
┌─────────────────────────────────────────────────────────────────┐
│                       FastAPI Backend                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  POST /api/{mode}/ingest                                  │  │
│  │  POST /api/{mode}/chat                                    │  │
│  │  GET  /api/{mode}/sessions/{id}                            │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    LangGraph Orchestration                      │
│        ┌─────────────┐        ┌─────────────┐                  │
│        │  retrieve    │  →     │  generate    │                  │
│        │  (Chroma)    │        │  (LLM)       │                  │
│        └─────────────┘        └─────────────┘                  │
│   one graph per mode: pdf_graph / youtube_graph /                │
│   github_graph / gmail_graph — identical shape, different        │
│   ingestion feeding the same collection                          │
└─────────────────────────────────────────────────────────────────┘
                            ↓
        ┌──────────┬──────────────┬───────────────┬──────────┐
        ↓          ↓              ↓                ↓
   ┌─────────┐ ┌──────────┐ ┌────────────┐   ┌──────────┐
   │ PyPDF   │ │ YouTube  │ │ PyGithub   │   │ Gmail API │
   │ Loader  │ │ Transcript│ │ (repo walk)│   │ (OAuth2)  │
   └─────────┘ └──────────┘ └────────────┘   └──────────┘
```

### Graph Nodes (per mode)

1. **retrieve**: Searches the mode's Chroma collection for the top-k relevant chunks
2. **generate**: Builds a context-grounded prompt and calls the LLM for an answer

---

## 📦 Project Structure

```
chatverse/
├── chatverse-backend/
│   ├── app/
│   │   ├── main.py                   # FastAPI app, CORS, router mounting
│   │   ├── config.py                  # .env-loaded settings
│   │   ├── schemas.py                  # IngestResponse / ChatRequest / ChatResponse
│   │   ├── core/
│   │   │   ├── llm.py                   # LLM + embeddings client factory
│   │   │   ├── vectorstore.py            # Chroma collection helper
│   │   │   └── gmail_auth.py              # OAuth2 credential flow
│   │   ├── graphs/
│   │   │   ├── pdf_graph.py
│   │   │   ├── youtube_graph.py
│   │   │   ├── github_graph.py
│   │   │   └── gmail_graph.py
│   │   └── routers/
│   │       ├── pdf.py
│   │       ├── youtube.py
│   │       ├── github.py
│   │       └── gmail.py
│   ├── requirements.txt
│   └── .env
│
├── chatverse-frontend/
│   ├── src/
│   │   ├── main.jsx                  # mounts <App/> in <BrowserRouter>
│   │   ├── App.jsx                    # routes: "/" and "/app"
│   │   ├── api/
│   │   │   └── client.js               # axios calls matching the API contract
│   │   ├── hooks/
│   │   │   ├── useDocuments.js          # ingest state
│   │   │   └── useChat.js                # chat state
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   └── HomePage.jsx
│   │   ├── components/
│   │   │   └── Sidebar.jsx
│   │   └── styles/
│   │       ├── global.css
│   │       ├── landing.css
│   │       └── app.css
│   └── package.json
│
└── README.md
```

---

## 🔌 API Endpoints

### Base URL
```
http://127.0.0.1:8000
```

Every mode (`pdf`, `youtube`, `github`, `gmail`) exposes the same three endpoints.

### 1. Ingest Endpoint
**Load a source and index it for retrieval**

```http
POST /api/pdf/ingest
Content-Type: multipart/form-data

file: <PDF file>
```
```http
POST /api/youtube/ingest
Content-Type: application/json

{ "url": "https://youtube.com/watch?v=..." }
```
```http
POST /api/github/ingest
Content-Type: application/json

{ "repo_url": "owner/repo" }
```
```http
POST /api/gmail/ingest
Content-Type: application/json

{ "query": "from:someone@example.com" }
```

**Response:**
```json
{
  "session_id": "a1b2c3d4-...",
  "status": "success",
  "chunks_indexed": 42
}
```

---

### 2. Chat Endpoint
**Ask a question about an ingested source**

```http
POST /api/{mode}/chat
Content-Type: application/json

{
  "session_id": "a1b2c3d4-...",
  "message": "What does chapter 3 conclude?"
}
```

**Response:**
```json
{
  "answer": "Chapter 3 reports 91.4% accuracy on the held-out test set...",
  "sources": [
    { "content": "...", "metadata": { "source": "chapter3.pdf", "page": 18 } }
  ],
  "session_id": "a1b2c3d4-..."
}
```

**Status Codes:**
- `200`: Success
- `404`: Unknown `session_id` — ingest a source first
- `500`: Server error (usually a missing/invalid API key)

---

### 3. History Endpoint
```http
GET /api/{mode}/sessions/{session_id}
```

**Response:**
```json
{
  "session_id": "a1b2c3d4-...",
  "history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

---

## 📖 Usage Guide

### 1. Prerequisites

```bash
# System Requirements
- Python 3.12+
- Node.js 18+
- Gemini API key (or OpenAI API key)
- GitHub token (optional, for higher rate limits on GitHub mode)
- Google Cloud OAuth credentials (for Gmail mode)
```

### 2. Backend Installation

```bash
cd chatverse-backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

pip install -r requirements.txt
```

### 3. Environment Configuration

Create `chatverse-backend/.env`:

```env
# LLM Configuration (Gemini)
GOOGLE_API_KEY=your_gemini_api_key_here

# Vector Store
CHROMA_PERSIST_DIR=./chroma_db

# GitHub Mode
GITHUB_TOKEN=your_github_token_here

# Gmail Mode
GMAIL_CREDENTIALS_PATH=./credentials.json

# CORS
CORS_ORIGINS=http://localhost:5173
```

### 4. Running the Application

**Terminal 1 — Backend:**
```bash
source venv/bin/activate
cd chatverse-backend
uvicorn app.main:app --reload
```

**Terminal 2 — Frontend:**
```bash
cd chatverse-frontend
npm install
npm run dev
```

**Access the Application:**
- Web Interface: http://localhost:5173
- API Documentation (Swagger): http://127.0.0.1:8000/docs
- Health Check: http://127.0.0.1:8000/health

### 5. Example Usage

**Using the Web Interface:**
1. Navigate to http://localhost:5173
2. Click **Start chatting free**
3. Pick a mode (PDF / YouTube / GitHub / Gmail)
4. Upload a file or paste a link
5. Ask questions in the chat window

**Using cURL:**
```bash
# Ingest a PDF
curl -X POST http://127.0.0.1:8000/api/pdf/ingest \
  -F "file=@/path/to/document.pdf"

# Chat with it
curl -X POST http://127.0.0.1:8000/api/pdf/chat \
  -H "Content-Type: application/json" \
  -d '{"session_id": "PASTE_SESSION_ID", "message": "Summarize this document"}'
```

**Using Python:**
```python
import requests

response = requests.post(
    "http://127.0.0.1:8000/api/pdf/chat",
    json={"session_id": "PASTE_SESSION_ID", "message": "What is this about?"}
)
print(response.json())
```

---

## 🔧 Configuration

### Key Configuration Files

#### `app/config.py`
```python
# Loaded from .env via pydantic-settings
GOOGLE_API_KEY          # Gemini LLM + embeddings authentication
CHROMA_PERSIST_DIR      # Vector store location on disk
GITHUB_TOKEN            # GitHub API rate-limit headroom
GMAIL_CREDENTIALS_PATH  # OAuth2 client secret file
CORS_ORIGINS            # Allowed frontend origin(s)
```

#### `app/core/llm.py`
Centralizes the LLM and embeddings client — swapping providers (OpenAI ↔ Gemini) means editing this one file only.

### Build Order Logic

Each mode was built in order of rising ingestion complexity, not feature priority:

```
Build Order
├── PDF     → no auth, no external API (simplest)
├── YouTube → transcript API, no key required
├── GitHub  → GitHub API, optional token
└── Gmail   → OAuth2 + privacy-sensitive data (most complex)
```

---

## 🧪 Testing the API

### Using FastAPI Interactive Documentation

1. Navigate to http://127.0.0.1:8000/docs
2. Expand `POST /api/pdf/ingest`
3. Click **Try it out**
4. Upload a PDF via the file picker
5. Click **Execute** and copy the returned `session_id`
6. Repeat for `POST /api/pdf/chat` using that `session_id`

### Example Test Cases

**Test 1: PDF ingestion**
```bash
curl -X POST http://127.0.0.1:8000/api/pdf/ingest -F "file=@notes.pdf"
```

**Test 2: Chat on an ingested PDF**
```json
{
  "session_id": "<from test 1>",
  "message": "What are the main topics covered?"
}
```

**Test 3: Health check**
```bash
curl http://127.0.0.1:8000/health
```

---

## 🔐 Security Considerations

- Store API keys in `.env` file (never commit)
- Never commit `chroma_db/` or `token.json` — both contain indexed personal data
- Use a throwaway Gmail account when demoing Gmail mode publicly
- Validate uploaded file types before processing
- Use HTTPS in production
- Rotate `GITHUB_TOKEN` and `GOOGLE_API_KEY` periodically

---

## 🚀 Deployment

### Local Development
```bash
uvicorn app.main:app --reload
```

### Production Deployment
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Frontend Build
```bash
cd chatverse-frontend
npm run build   # outputs to dist/
```

---

## 📊 Performance Notes

- **Chunking**: PDF/GitHub use ~1000-1200 char chunks with overlap; YouTube uses ~60s transcript windows
- **Isolated Collections**: Each `mode + session_id` gets its own Chroma collection — no cross-session leakage
- **In-Memory History**: Chat history currently lives in a Python dict per router; swap for Redis/SQLite before scaling past local development

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Follow the existing `retrieve` → `generate` graph pattern for new modes
4. Commit with descriptive messages (`git commit -m 'feat: Add YourFeature'`)
5. Push to your branch and open a Pull Request

### Code Quality
- Follow PEP 8 for Python, keep components small and prop-driven in React
- Add docstrings to new graph nodes and router functions
- Keep the API contract (`schemas.py`) as the source of truth for request/response shapes

---

## 📚 Technology Stack

| Component | Technology |
|-----------|-----------|
| **LLM Framework** | LangChain |
| **Workflow Orchestration** | LangGraph |
| **Web Framework** | FastAPI |
| **ASGI Server** | Uvicorn |
| **Vector Database** | ChromaDB |
| **LLM Provider** | Google Gemini |
| **PDF Parsing** | PyPDF |
| **YouTube Transcripts** | youtube-transcript-api |
| **GitHub Access** | PyGithub |
| **Gmail Access** | google-api-python-client + google-auth-oauthlib |
| **Frontend Framework** | React 18 + Vite |
| **Routing** | react-router-dom |
| **HTTP Client** | axios |
| **Icons** | lucide-react |

---

## ❓ FAQ

**Q: Is my data used to index anything besides my own session?**
A: No. Every upload lives in its own isolated Chroma collection, scoped to your session and mode.

**Q: Can an answer be wrong?**
A: Answers are grounded only in retrieved passages, and every reply includes the exact source chunks used — check the source panel if something looks off.

**Q: Do I need Gmail connected to use the other modes?**
A: No. Each mode is fully independent.

**Q: Can I use a different LLM provider?**
A: Yes — edit `app/core/llm.py` only; every graph and router imports from there.

**Q: How is conversation history stored?**
A: In-memory per router process for now. Restarting the backend clears it — swap in Redis/SQLite for persistence.

---

## 📝 Documentation References

- `01_ARCHITECTURE_AND_ANTIGRAVITY_PROMPTS.md` — architecture + Antigravity scaffolding prompts
- `02_BACKEND_CORE_AND_PDF_MODE.md` — FastAPI core + PDF mode, full code
- `03_YOUTUBE_GITHUB_GMAIL_MODES.md` — remaining three modes
- `04_FRONTEND_REACT.md` — React frontend structure and wiring

---

## 📈 Project Status

- ✅ Backend core (FastAPI + LangGraph + Chroma)
- ✅ Chat with PDF — shipped
- ✅ Chat with YouTube — shipped
- 🚧 Chat with GitHub — in progress
- 📋 Chat with Gmail — planned
- ✅ React landing page + dashboard shell
- ✅ Frontend wired to live backend

---

## 🗺️ Roadmap

- [ ] Redis/SQLite-backed chat history
- [ ] Streaming responses
- [ ] Multi-session sidebar (switch between past chats)
- [ ] Query rewriting / relevance grading nodes
- [ ] Docker Compose setup
- [ ] Deploy to production

---

## 👤 Author

**Neeraj**
- Department of AI & ML, R. C. Patel Institute of Technology

---

## 📄 License

This project is licensed under the MIT License.