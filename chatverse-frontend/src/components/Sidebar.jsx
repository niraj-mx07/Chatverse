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
    Video,
    Code,
    Mail,
} from "lucide-react";

import { MODES } from "../modes";

const NAV_TOP = [
    { id: "home", label: "Home", icon: Home },
    { id: "sessions", label: "Sessions", icon: ListChecks },
    { id: "sources", label: "Sources", icon: FileText },
];

const NAV_BOTTOM = [
    { id: "templates", label: "Templates", icon: Sparkles },
    { id: "community", label: "Community", icon: Users },
    { id: "docs", label: "Docs", icon: BookOpen },
    { id: "saved", label: "Saved answers", icon: Bookmark },
];

export default function Sidebar({
    activeSection,
    onSectionChange,
    onModeSelect,
    isCollapsed,
    onToggleCollapse
}) {
    return (
        <aside className="app-sidebar">
            <div className="sb-top">
                <div className="sb-brand">
                    <span className="sb-mark" />
                    <span>ChatVerse</span>
                </div>
                <div className="sb-icons">
                    <button className="sb-icon-btn" title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"} onClick={onToggleCollapse}>
                        <PanelLeft size={16} />
                    </button>
                    <button className="sb-icon-btn" title="Notifications">
                        <Bell size={16} />
                    </button>
                </div>
            </div>

            <div className="sb-search">
                <Search size={15} />
                <input type="text" placeholder="Search" className="sb-search-input" />
            </div>

            <nav className="sb-nav" style={{ marginTop: 8 }}>
                {NAV_TOP.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            className={`sb-item ${activeSection === item.id ? "active" : ""}`}
                            onClick={() => onSectionChange(item.id)}
                        >
                            <Icon size={16} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="sb-section-label">
                <span>Modes</span>
                <ChevronDown size={13} />
            </div>
            {MODES.map((m) => {
                const Icon = m.icon;
                return (
                    <div
                        className="sb-mode-item"
                        key={m.label}
                        onClick={() => onModeSelect(m.label)}
                        style={{ cursor: "pointer" }}
                    >
                        <span
                            className="sb-mode-avatar"
                            style={{ background: m.color }}
                        />
                        <span className="mode-label">{m.label}</span>
                    </div>
                );
            })}
            <button
                className="sb-item"
                style={{ color: "var(--text-faint)" }}
                onClick={() => onSectionChange("home")}
            >
                <Plus size={16} />
                <span>New source</span>
            </button>

            <div className="sb-divider" />

            <nav className="sb-nav">
                {NAV_BOTTOM.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            className={`sb-item ${activeSection === item.id ? "active" : ""}`}
                            onClick={() => onSectionChange(item.id)}
                        >
                            <Icon size={16} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
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
