import { useState } from "react";
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
    Youtube,
    Github,
    Mail,
    Clock,
} from "lucide-react";
import Sidebar from "../components/Sidebar.jsx";
import "../styles/app.css";

const MODE_CHIPS = [
    { label: "Chat with PDF", color: "#f43f5e", icon: FileText, isNew: true },
    { label: "Chat with YouTube", color: "#f97316", icon: Youtube },
    { label: "Chat with GitHub", color: "#a1a1aa", icon: Github },
    { label: "Chat with Gmail", color: "#3b82f6", icon: Mail },
];

const RECOMMENDATIONS = [
    {
        icon: FileText,
        title: "Summarize my lecture notes PDF",
        desc: "Upload a PDF and get a one-paragraph summary plus the three most-cited claims, each linked to its page.",
    },
    {
        icon: Github,
        title: "Explain a new repo before you clone it",
        desc: "Point ChatVerse at any public GitHub repo and ask where a feature is implemented before you dive in.",
    },
];

export default function HomePage() {
    const [message, setMessage] = useState("");

    return (
        <div className="app-shell">
            <Sidebar />

            <main className="app-main">
                <div className="app-main-inner">
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
                                <button className="pill-select">
                                    <InfinityIcon size={13} />
                                    Source
                                    <ChevronDown size={13} />
                                </button>
                                <button className="icon-btn">
                                    <Plus size={14} />
                                </button>
                            </div>
                            <div className="tool-right">
                                <button className="pill-select">
                                    GPT-4o mini
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
                </div>
            </main>
        </div>
    );
}
