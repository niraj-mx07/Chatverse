import {
    Search,
    Home,
    ListChecks,
    FileText,
    ChevronDown,
    Bell,
    PanelLeft,
    Sparkles,
    Users,
    BookOpen,
    Bookmark,
    ArrowRight,
    HelpCircle,
    Plus,
} from "lucide-react";

const MODES = [
    { label: "PDF Chat", color: "#f43f5e" },
    { label: "YouTube Chat", color: "#f97316" },
];

export default function Sidebar() {
    return (
        <aside className="app-sidebar">
            <div className="sb-top">
                <div className="sb-brand">
                    <span className="sb-mark" />
                    ChatVerse
                </div>
                <div className="sb-icons">
                    <button className="sb-icon-btn" title="Collapse sidebar">
                        <PanelLeft size={16} />
                    </button>
                    <button className="sb-icon-btn" title="Notifications">
                        <Bell size={16} />
                    </button>
                </div>
            </div>

            <button className="sb-search">
                <Search size={15} />
                Search
            </button>

            <nav className="sb-nav" style={{ marginTop: 8 }}>
                <button className="sb-item active">
                    <Home size={16} />
                    Home
                </button>
                <button className="sb-item">
                    <ListChecks size={16} />
                    Sessions
                </button>
                <button className="sb-item">
                    <FileText size={16} />
                    Sources
                </button>
            </nav>

            <div className="sb-section-label">
                Modes
                <ChevronDown size={13} />
            </div>
            {MODES.map((m) => (
                <div className="sb-mode-item" key={m.label}>
                    <span
                        className="sb-mode-avatar"
                        style={{ background: m.color }}
                    />
                    {m.label}
                </div>
            ))}
            <button className="sb-item" style={{ color: "var(--text-faint)" }}>
                <Plus size={16} />
                New source
            </button>

            <div className="sb-divider" />

            <nav className="sb-nav">
                <button className="sb-item">
                    <Sparkles size={16} />
                    Templates
                </button>
                <button className="sb-item">
                    <Users size={16} />
                    Community
                </button>
                <button className="sb-item">
                    <BookOpen size={16} />
                    Docs
                </button>
                <button className="sb-item">
                    <Bookmark size={16} />
                    Saved answers
                </button>
            </nav>

            <div className="sb-spacer" />

            <div className="sb-upgrade">
                <div className="sb-upgrade-icon">
                    <Sparkles size={16} />
                </div>
                <div className="sb-upgrade-text">
                    <div className="t1">Upgrade your plan</div>
                    <div className="t2">Unlock more capacity &amp; sources</div>
                </div>
                <ArrowRight size={15} color="var(--text-faint)" />
            </div>

            <button className="sb-help" title="Help">
                <HelpCircle size={15} />
            </button>
        </aside>
    );
}
