import { FileText, Video, Code, Mail } from "lucide-react";

export const MODES = [
    { id: "pdf", label: "PDF Chat", color: "#f43f5e", icon: FileText, isNew: true },
    { id: "youtube", label: "YouTube Chat", color: "#f97316", icon: Video },
    { id: "github", label: "GitHub Chat", color: "#a1a1aa", icon: Code },
    { id: "gmail", label: "Gmail Chat", color: "#3b82f6", icon: Mail },
];

export const MODE_BY_LABEL = Object.fromEntries(MODES.map((m) => [m.label, m]));
export const MODE_BY_ID = Object.fromEntries(MODES.map((m) => [m.id, m]));
