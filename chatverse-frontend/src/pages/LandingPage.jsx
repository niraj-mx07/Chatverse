import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/landing.css";

const FAQ_ITEMS = [
    {
        q: "Is my data used to index anything besides my own session?",
        a: "No. Every upload lives in its own isolated collection, scoped to your session and the mode you used — a PDF you upload never mixes with another source.",
    },
    {
        q: "Can an answer be wrong?",
        a: "Answers are grounded only in the retrieved passages, and every reply comes with the exact source chunks it used — check the source panel if something looks off.",
    },
    {
        q: "Do I need to connect Gmail to use the other modes?",
        a: "No. Each mode is independent — PDF, YouTube, and GitHub work without any Google account connection.",
    },
    {
        q: "What happens to a GitHub repo after I stop chatting?",
        a: "Only the indexed text chunks are stored for retrieval — nothing is executed, and you can clear a session at any time.",
    },
];

function FaqAccordion() {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <div className="faq">
            {FAQ_ITEMS.map((item, i) => (
                <div key={i} className={`faq-item ${openIndex === i ? "open" : ""}`}>
                    <div
                        className="faq-q"
                        onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                    >
                        {item.q}
                        <span className="plus">+</span>
                    </div>
                    <div
                        className="faq-a"
                        style={{ maxHeight: openIndex === i ? "160px" : "0px" }}
                    >
                        <p>{item.a}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function LandingPage() {
    return (
        <div className="landing">
            <header>
                <div className="wrap">
                    <nav>
                        <div className="logo">
                            <span className="logo-mark" />
                            ChatVerse
                        </div>
                        <div className="nav-links">
                            <a href="#features">Sources</a>
                            <a href="#how">How it works</a>
                            <a href="#roadmap">Roadmap</a>
                            <a href="#stack">Stack</a>
                            <a href="#faq">FAQ</a>
                        </div>
                        <div className="nav-cta">
                            <Link className="btn btn-ghost" to="/app">
                                Sign in
                            </Link>
                            <Link className="btn btn-primary" to="/app">
                                Get started
                            </Link>
                        </div>
                    </nav>
                </div>
            </header>

            <section className="hero">
                <div className="wrap">
                    <span className="eyebrow">
                        <span className="dot" /> Now indexing PDF · YouTube · GitHub ·
                        Gmail
                    </span>
                    <h1>
                        One conversation. <span className="grad">Every source you have.</span>
                    </h1>
                    <p>
                        ChatVerse is a multi-mode RAG chat platform. Drop in a PDF, a
                        video, a repo, or your inbox — and ask it anything, with every
                        answer traced back to the exact line it came from.
                    </p>
                    <div className="hero-ctas">
                        <Link className="btn btn-accent" to="/app">
                            Start chatting free
                        </Link>
                        <a className="btn btn-ghost" href="#how">
                            See how it works
                        </a>
                    </div>

                    <div className="hero-screenshot">
                        <img src="/hero-dashboard.png" alt="ChatVerse App Dashboard" />
                    </div>
                </div>
            </section>

            <div className="strip">
                <div className="wrap">
                    <div className="strip-item">
                        <b>4</b>
                        <span>source types, one interface</span>
                    </div>
                    <div className="strip-item">
                        <b>&lt;2s</b>
                        <span>average retrieval time</span>
                    </div>
                    <div className="strip-item">
                        <b>100%</b>
                        <span>answers cited to source</span>
                    </div>
                    <div className="strip-item">
                        <b>1</b>
                        <span>API contract for every mode</span>
                    </div>
                </div>
            </div>

            <section id="features">
                <div className="wrap">
                    <div className="section-head">
                        <span className="eyebrow">Sources</span>
                        <h2>Chat with whatever you already have</h2>
                        <p>
                            Same interface, same citation guardrails, four completely
                            different ingestion pipelines underneath.
                        </p>
                    </div>
                    <div className="bento">
                        <div className="bento-card" style={{ "--card-accent": "#f43f5e" }}>
                            <div className="icon">📄</div>
                            <h3>Chat with PDF</h3>
                            <p>
                                Upload any document and ask questions grounded in its exact
                                pages — no more Ctrl+F.
                            </p>
                            <span className="tag">PyPDF · Chroma</span>
                        </div>
                        <div className="bento-card" style={{ "--card-accent": "#f97316" }}>
                            <div className="icon">▶</div>
                            <h3>Chat with YouTube</h3>
                            <p>
                                Paste a link, get a searchable transcript, and jump straight
                                to the timestamp that answers your question.
                            </p>
                            <span className="tag">Transcript API</span>
                        </div>
                        <div className="bento-card" style={{ "--card-accent": "#111827" }}>
                            <div className="icon">⌥</div>
                            <h3>Chat with GitHub</h3>
                            <p>
                                Point it at a repo and ask where something is implemented —
                                answers come back with the file path.
                            </p>
                            <span className="tag">PyGithub · AST-aware</span>
                        </div>
                        <div className="bento-card" style={{ "--card-accent": "#3b82f6" }}>
                            <div className="icon">✉</div>
                            <h3>Chat with Gmail</h3>
                            <p>
                                Search your inbox in plain language instead of guessing the
                                right keywords.
                            </p>
                            <span className="tag">OAuth2 · Gmail API</span>
                        </div>
                    </div>
                </div>
            </section>

            <section id="how" style={{ background: "var(--bg-soft)" }}>
                <div className="wrap">
                    <div className="section-head">
                        <span className="eyebrow">How it works</span>
                        <h2>The same three steps, every time</h2>
                        <p>
                            Every mode speaks the same contract — ingest, chat, and history
                            — so switching sources never feels like switching apps.
                        </p>
                    </div>
                    <div className="steps">
                        <div className="step">
                            <span className="num">01 — INGEST</span>
                            <h3>Bring a source</h3>
                            <p>
                                Upload a file or paste a link. It's chunked, embedded, and
                                stored in its own isolated collection.
                            </p>
                        </div>
                        <div className="step">
                            <span className="num">02 — RETRIEVE</span>
                            <h3>Ask a question</h3>
                            <p>
                                ChatVerse searches only that source for the passages most
                                relevant to what you asked.
                            </p>
                        </div>
                        <div className="step">
                            <span className="num">03 — ANSWER</span>
                            <h3>Get a grounded reply</h3>
                            <p>
                                The answer comes back with the exact chunks it was built
                                from, visible in the source panel.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="roadmap">
                <div className="wrap">
                    <div className="section-head">
                        <span className="eyebrow">Build order</span>
                        <h2>Shipped in this order, on purpose</h2>
                        <p>
                            Each mode reuses the same retrieval pipeline — the build order
                            reflects rising ingestion complexity, not feature priority.
                        </p>
                    </div>
                    <div className="roadmap">
                        <div className="rm-item done" data-n="1">
                            <h3>
                                Chat with PDF <span className="status done">shipped</span>
                            </h3>
                            <p>
                                The simplest ingestion path — no auth, no external API.
                                Proved the retrieve → generate pattern end to end.
                            </p>
                        </div>
                        <div className="rm-item done" data-n="2">
                            <h3>
                                Chat with YouTube <span className="status done">shipped</span>
                            </h3>
                            <p>
                                Same graph, transcript-based ingestion with
                                timestamp-windowed chunks.
                            </p>
                        </div>
                        <div className="rm-item" data-n="3">
                            <h3>
                                Chat with GitHub{" "}
                                <span className="status">in progress</span>
                            </h3>
                            <p>
                                Multi-file ingestion at scale, with file-path-aware
                                citations.
                            </p>
                        </div>
                        <div className="rm-item" data-n="4">
                            <h3>
                                Chat with Gmail <span className="status">planned</span>
                            </h3>
                            <p>
                                OAuth2 and privacy-sensitive data handling — saved for last
                                on purpose.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="stack" style={{ background: "var(--bg-soft)" }}>
                <div className="wrap">
                    <div className="section-head">
                        <span className="eyebrow">Under the hood</span>
                        <h2>Built on a small, boring stack</h2>
                        <p>No exotic infrastructure — just tools that are easy to reason about.</p>
                    </div>
                    <div className="stack-row">
                        <div className="stack-chip">
                            <span className="sw" style={{ background: "#009688" }} />
                            FastAPI
                        </div>
                        <div className="stack-chip">
                            <span className="sw" style={{ background: "#6c5ce7" }} />
                            LangGraph
                        </div>
                        <div className="stack-chip">
                            <span className="sw" style={{ background: "#ff7a59" }} />
                            LangChain
                        </div>
                        <div className="stack-chip">
                            <span className="sw" style={{ background: "#f5a623" }} />
                            ChromaDB
                        </div>
                        <div className="stack-chip">
                            <span className="sw" style={{ background: "#61dafb" }} />
                            React + Vite
                        </div>
                    </div>
                </div>
            </section>

            <section id="faq">
                <div className="wrap">
                    <div className="section-head">
                        <span className="eyebrow">FAQ</span>
                        <h2>Good to know</h2>
                    </div>
                    <FaqAccordion />
                </div>
            </section>

            <section>
                <div className="wrap">
                    <div className="cta">
                        <h2>Bring your first source in under a minute</h2>
                        <p>PDF, video, repo, or inbox — pick one and start asking.</p>
                        <Link className="btn btn-accent" to="/app">
                            Get started free
                        </Link>
                    </div>
                </div>
            </section>

            <footer>
                <div className="wrap footer-row">
                    <div className="logo">
                        <span className="logo-mark" />
                        ChatVerse
                    </div>
                    <div className="footer-links">
                        <a href="#features">Sources</a>
                        <a href="#roadmap">Roadmap</a>
                        <a href="#stack">Stack</a>
                        <a href="#faq">FAQ</a>
                    </div>
                    <div className="footer-note">
                        © 2026 ChatVerse. Built with FastAPI, LangGraph &amp; React.
                    </div>
                </div>
            </footer>
        </div>
    );
}
