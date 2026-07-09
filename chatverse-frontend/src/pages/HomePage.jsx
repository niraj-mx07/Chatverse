import { useState, useRef, useEffect } from "react";
import { MODES, MODE_BY_LABEL } from "../modes";
import { ingestSource, sendChat, checkHealth } from "../api";
import {
    Infinity as InfinityIcon,
    ChevronDown,
    Plus,
    ArrowUp,
    MessageSquare,
    Send as SendIcon,
    AtSign,
    X,
    RefreshCw,
    FileText,
    Video,
    Code,
    Mail,
    Clock,
    ListChecks,
    FolderOpen,
    Sparkles,
    Users,
    BookOpen,
    Bookmark,
    ExternalLink,
} from "lucide-react";
import Sidebar from "../components/Sidebar.jsx";
import "../styles/app.css";

const MODE_CHIPS = MODES;

const RECOMMENDATIONS = [
    {
        icon: FileText,
        title: "Summarize my lecture notes PDF",
        desc: "Upload a PDF and get a one-paragraph summary plus the three most-cited claims, each linked to its page.",
    },
    {
        icon: Code,
        title: "Explain a new repo before you clone it",
        desc: "Point ChatVerse at any public GitHub repo and ask where a feature is implemented before you dive in.",
    },
    {
        icon: Video,
        title: "Break down a YouTube lecture",
        desc: "Paste a YouTube link to index its transcript and ask questions with timestamped answers.",
    },
    {
        icon: Mail,
        title: "Search your Gmail for context",
        desc: "Connect your inbox and ask ChatVerse to find emails, threads, or attachments by topic.",
    },
];

/* ---- Section content panels ---- */

function HomeContent({ message, setMessage, onModeSelect }) {
    return (
        <>
            <div className="greet-head">
                <span className="greet-avatar" />
                <span className="greet-name">ChatVerse</span>
            </div>
            <div className="greet-lines">
                <p>Alright! Let's begin 😊</p>
                <p className="soft">Pick a source below, or just start typing.</p>
            </div>

            <div className="input-card">
                <textarea
                    className="input-textarea"
                    placeholder="Ask a question, or paste a link… Press Ctrl+Enter to insert a line break…"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <div className="input-toolbar">
                    <div className="tool-left">
                        <button className="icon-btn">
                            <Plus size={14} />
                        </button>
                    </div>
                    <div className="tool-right">
                        <button className="pill-select">
                            Gemini
                            <ChevronDown size={13} />
                        </button>
                        <button className="send-btn">
                            <ArrowUp size={16} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="messaging-row">
                <div className="messaging-left">
                    <MessageSquare size={14} />
                    Talk to ChatVerse on your favorite messaging apps
                </div>
                <div className="messaging-icons">
                    <SendIcon size={15} />
                    <AtSign size={15} />
                    <button className="close-x">
                        <X size={15} />
                    </button>
                </div>
            </div>

            <div className="mode-chip-row">
                <span className="new-badge">New</span>
                {MODE_CHIPS.map((m) => {
                    const Icon = m.icon;
                    return (
                        <button
                            key={m.label}
                            className="mode-chip"
                            style={{ "--mode-color": m.color }}
                            onClick={() => onModeSelect(m.label)}
                        >
                            <span className="dot">
                                <Icon size={10} color="#fff" />
                            </span>
                            {m.label}
                        </button>
                    );
                })}
            </div>

            <div className="rec-head">
                <span className="label">Some recommendations for your setup</span>
                <button className="rec-refresh">
                    <RefreshCw size={13} />
                    Refresh
                </button>
            </div>

            {RECOMMENDATIONS.map((rec) => {
                const Icon = rec.icon;
                return (
                    <div className="rec-card" key={rec.title}>
                        <div className="rec-card-top">
                            <div className="rec-icon">
                                <Icon size={15} />
                            </div>
                            <span className="title">{rec.title}</span>
                            <Clock size={14} className="clock" />
                        </div>
                        <p className="rec-desc">{rec.desc}</p>
                    </div>
                );
            })}
        </>
    );
}

function SessionsContent() {
    return (
        <div className="section-page">
            <h2><ListChecks size={22} /> Sessions</h2>
            <p className="section-subtitle">Your recent chat sessions across all modes.</p>
            <div className="empty-state">
                <ListChecks size={40} />
                <h3>No sessions yet</h3>
                <p>Start a conversation from the Home page or pick a mode — your sessions will appear here.</p>
            </div>
        </div>
    );
}

function SourcesContent() {
    return (
        <div className="section-page">
            <h2><FolderOpen size={22} /> Sources</h2>
            <p className="section-subtitle">All indexed documents, repos, videos, and email threads.</p>
            <div className="empty-state">
                <FolderOpen size={40} />
                <h3>No sources indexed</h3>
                <p>Upload a PDF, paste a YouTube link, connect a GitHub repo, or link your Gmail to get started.</p>
            </div>
        </div>
    );
}

function TemplatesContent() {
    const templates = [
        { title: "Research Paper Analysis", desc: "Upload a paper and get structured insights: abstract, methodology, results, and citations." },
        { title: "Code Review Assistant", desc: "Point at a GitHub PR and get a thorough review with suggestions and potential issues." },
        { title: "Lecture Note Summarizer", desc: "Drop a lecture video or PDF and get concise, structured notes with key takeaways." },
        { title: "Email Thread Digest", desc: "Summarize long email threads into action items and key decisions." },
    ];
    return (
        <div className="section-page">
            <h2><Sparkles size={22} /> Templates</h2>
            <p className="section-subtitle">Pre-built workflows to supercharge your productivity.</p>
            <div className="template-grid">
                {templates.map((t) => (
                    <div className="rec-card" key={t.title}>
                        <div className="rec-card-top">
                            <div className="rec-icon"><Sparkles size={15} /></div>
                            <span className="title">{t.title}</span>
                        </div>
                        <p className="rec-desc">{t.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function CommunityContent() {
    return (
        <div className="section-page">
            <h2><Users size={22} /> Community</h2>
            <p className="section-subtitle">Connect with other ChatVerse users and share workflows.</p>
            <div className="empty-state">
                <Users size={40} />
                <h3>Community Hub</h3>
                <p>Browse shared templates, ask questions, and discover new ways to use ChatVerse. Coming soon!</p>
            </div>
        </div>
    );
}

function DocsContent() {
    const docs = [
        { title: "Getting Started", desc: "Learn how to set up ChatVerse and index your first source." },
        { title: "PDF Mode Guide", desc: "How to upload, index, and query PDFs with page-level citations." },
        { title: "YouTube Mode Guide", desc: "Index video transcripts and get timestamped answers." },
        { title: "GitHub Mode Guide", desc: "Connect repos and navigate codebases with natural language." },
        { title: "Gmail Mode Guide", desc: "Search your inbox and surface context from email threads." },
        { title: "API Reference", desc: "Integrate ChatVerse into your own tools and workflows." },
    ];
    return (
        <div className="section-page">
            <h2><BookOpen size={22} /> Documentation</h2>
            <p className="section-subtitle">Everything you need to master ChatVerse.</p>
            <div className="template-grid">
                {docs.map((d) => (
                    <div className="rec-card" key={d.title} style={{ cursor: "pointer" }}>
                        <div className="rec-card-top">
                            <div className="rec-icon"><BookOpen size={15} /></div>
                            <span className="title">{d.title}</span>
                            <ExternalLink size={14} className="clock" />
                        </div>
                        <p className="rec-desc">{d.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SavedContent() {
    return (
        <div className="section-page">
            <h2><Bookmark size={22} /> Saved Answers</h2>
            <p className="section-subtitle">Bookmark answers to revisit them later.</p>
            <div className="empty-state">
                <Bookmark size={40} />
                <h3>Nothing saved yet</h3>
                <p>When you get a great answer, click the bookmark icon to save it here for quick reference.</p>
            </div>
        </div>
    );
}

function ModeChatContent({ mode, message, setMessage, sessionId, history, isProcessing, onIngest, onChat }) {
    const fileInputRef = useRef(null);

    const modeMeta = MODE_BY_LABEL[mode];
    const config = {
        apiMode: modeMeta?.id || "pdf",
        color: modeMeta?.color || "#f43f5e",
        icon: modeMeta?.icon || FileText,
        placeholder: sessionId
            ? (mode === "PDF Chat" ? "Ask a question about the PDF..." : "Ask a question...")
            : (mode === "PDF Chat" ? "Upload a PDF (using +)" : mode === "YouTube Chat" ? "Paste a YouTube link..." : mode === "GitHub Chat" ? "Enter a GitHub repo URL (e.g. owner/repo)..." : "Enter a Gmail search query (e.g. from:me)..."),
        hint: sessionId
            ? (mode === "PDF Chat" ? "PDF indexed. Ask a question." : mode === "YouTube Chat" ? "Video indexed. Ask a question." : mode === "GitHub Chat" ? "Repo indexed. Ask a question." : "Emails indexed. Ask a question.")
            : (mode === "PDF Chat" ? "Drop a PDF file here or use + to begin indexing." : mode === "YouTube Chat" ? "Paste a YouTube URL to index its transcript." : mode === "GitHub Chat" ? "Paste a GitHub repository URL to index the codebase." : "Enter a query to index and search your inbox."),
    };
    const Icon = config.icon;

    const handleSend = () => {
        if (!message.trim() || isProcessing) return;
        if (!sessionId && mode !== "PDF Chat") {
            onIngest(config.apiMode, message);
        } else if (sessionId) {
            onChat(config.apiMode, message);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.ctrlKey && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onIngest("pdf", file);
        }
    };

    return (
        <>
            {(!history || history.length === 0) && (
                <>
                    <div className="greet-head">
                        <span className="greet-avatar" style={{ background: config.color }} />
                        <span className="greet-name">{mode}</span>
                    </div>
                    <div className="greet-lines">
                        <p>{config.hint}</p>
                        <p className="soft">Ask anything — every answer will be traced back to its source.</p>
                    </div>
                </>
            )}

            {history && history.length > 0 && (
                <div className="chat-history">
                    {history.map((turn, i) => (
                        <div key={i} className={`chat-message ${turn.role}`}>
                            <div className="msg-bubble">{turn.content}</div>
                            {turn.sources && turn.sources.length > 0 && turn.role === "assistant" && (
                                <div className="chat-sources">
                                    {turn.sources.map((src, j) => (
                                        <span key={j} className="source-badge">
                                            <FileText size={10} />
                                            Citation {j + 1}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    {isProcessing && (
                        <div className="chat-message assistant">
                            <div className="msg-bubble" style={{ color: "var(--text-soft)" }}>Processing...</div>
                        </div>
                    )}
                </div>
            )}

            <div className="input-card">
                <textarea
                    className="input-textarea"
                    placeholder={config.placeholder}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isProcessing || (mode === "PDF Chat" && !sessionId && isProcessing)}
                />
                <div className="input-toolbar">
                    <div className="tool-left">
                        {mode === "PDF Chat" && !sessionId && (
                            <>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    ref={fileInputRef}
                                    style={{ display: "none" }}
                                    onChange={handleFileChange}
                                />
                                <button className="icon-btn" onClick={() => fileInputRef.current.click()} disabled={isProcessing}>
                                    <Plus size={14} />
                                </button>
                            </>
                        )}
                        {(mode !== "PDF Chat" || sessionId) && (
                            <button className="icon-btn">
                                <Plus size={14} />
                            </button>
                        )}
                    </div>
                    <div className="tool-right">
                        <button className="pill-select">
                            Gemini
                            <ChevronDown size={13} />
                        </button>
                        <button className="send-btn" onClick={handleSend} disabled={isProcessing || (!message.trim() && mode !== "PDF Chat")}>
                            <ArrowUp size={16} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="rec-head">
                <span className="label">Try asking…</span>
            </div>
            <div className="rec-card">
                <div className="rec-card-top">
                    <div className="rec-icon" style={{ background: config.color + "22", color: config.color }}>
                        <Icon size={15} />
                    </div>
                    <span className="title">
                        {mode === "PDF Chat" && "What are the key findings in chapter 3?"}
                        {mode === "YouTube Chat" && "When does the speaker explain the main concept?"}
                        {mode === "GitHub Chat" && "Where is the authentication logic implemented?"}
                        {mode === "Gmail Chat" && "Did anyone reply to the project proposal email?"}
                    </span>
                </div>
                <p className="rec-desc">
                    {mode === "PDF Chat" && "Summarize findings with page-level references."}
                    {mode === "YouTube Chat" && "Get timestamped answers from the video transcript."}
                    {mode === "GitHub Chat" && "Navigate the codebase with natural language queries."}
                    {mode === "Gmail Chat" && "Surface relevant emails and threads instantly."}
                </p>
            </div>
        </>
    );
}

/* ---- Main page shell ---- */

export default function HomePage() {
    const [message, setMessage] = useState("");
    const [activeSection, setActiveSection] = useState("home");
    const [activeMode, setActiveMode] = useState(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Backend state
    const [sessionIds, setSessionIds] = useState({});
    const [chatHistories, setChatHistories] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [backendOnline, setBackendOnline] = useState(null);

    useEffect(() => {
        checkHealth().then(setBackendOnline).catch(() => setBackendOnline(false));
    }, []);

    const handleSectionChange = (section) => {
        setActiveSection(section);
        setActiveMode(null);
    };

    const handleModeSelect = (mode) => {
        setActiveMode(mode);
        setActiveSection(null);
        setMessage("");
    };

    const handleIngest = async (apiMode, payload) => {
        setIsProcessing(true);
        setMessage("");
        try {
            const data = await ingestSource(apiMode, payload);
            setSessionIds((prev) => ({ ...prev, [activeMode]: data.session_id }));
            setChatHistories((prev) => ({ ...prev, [activeMode]: [] }));
        } catch (err) {
            console.error(err);
            alert("Error during ingestion: " + err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleChat = async (apiMode, userInput) => {
        const sessionId = sessionIds[activeMode];
        if (!sessionId) return;

        setIsProcessing(true);
        setMessage("");

        const newHistory = [...(chatHistories[activeMode] || []), { role: "user", content: userInput }];
        setChatHistories((prev) => ({ ...prev, [activeMode]: newHistory }));

        try {
            const data = await sendChat(apiMode, sessionId, userInput);
            setChatHistories((prev) => ({
                ...prev,
                [activeMode]: [
                    ...(prev[activeMode] || []),
                    { role: "assistant", content: data.answer, sources: data.sources },
                ],
            }));
        } catch (err) {
            console.error(err);
            setChatHistories((prev) => ({
                ...prev,
                [activeMode]: [
                    ...(prev[activeMode] || []),
                    { role: "assistant", content: `Error: ${err.message}` },
                ],
            }));
        } finally {
            setIsProcessing(false);
        }
    };

    const renderContent = () => {
        if (activeMode) {
            return (
                <ModeChatContent
                    mode={activeMode}
                    message={message}
                    setMessage={setMessage}
                    sessionId={sessionIds[activeMode]}
                    history={chatHistories[activeMode]}
                    isProcessing={isProcessing}
                    onIngest={handleIngest}
                    onChat={handleChat}
                />
            );
        }
        switch (activeSection) {
            case "sessions": return <SessionsContent />;
            case "sources": return <SourcesContent />;
            case "templates": return <TemplatesContent />;
            case "community": return <CommunityContent />;
            case "docs": return <DocsContent />;
            case "saved": return <SavedContent />;
            default: return <HomeContent message={message} setMessage={setMessage} onModeSelect={handleModeSelect} />;
        }
    };

    return (
        <div className={`app-shell ${isSidebarCollapsed ? "collapsed" : ""}`}>
            <Sidebar
                activeSection={activeSection}
                onSectionChange={handleSectionChange}
                onModeSelect={handleModeSelect}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
            <main className="app-main">
                {backendOnline === false && (
                    <div style={{ padding: "8px 16px", background: "#fef2f2", color: "#b91c1c", fontSize: 13, textAlign: "center" }}>
                        Backend offline — start it with: cd chatverse-backend && uvicorn app.main:app --reload --port 8000
                    </div>
                )}
                <div className="app-main-inner">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}
