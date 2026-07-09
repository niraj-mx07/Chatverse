import { API_BASE_URL } from "./config";

export function parseApiError(data, fallback) {
    if (!data?.detail) return fallback;
    if (typeof data.detail === "string") return data.detail;
    if (Array.isArray(data.detail)) {
        return data.detail.map((e) => e.msg || String(e)).join(", ");
    }
    return fallback;
}

export async function ingestSource(apiMode, payload) {
    let res;
    if (apiMode === "pdf") {
        const formData = new FormData();
        formData.append("file", payload);
        res = await fetch(`${API_BASE_URL}/${apiMode}/ingest`, {
            method: "POST",
            body: formData,
        });
    } else {
        let body = {};
        if (apiMode === "youtube") body = { url: payload };
        else if (apiMode === "github") body = { repo_url: payload };
        else if (apiMode === "gmail") body = { query: payload, max_results: 25 };

        res = await fetch(`${API_BASE_URL}/${apiMode}/ingest`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
    }

    const data = await res.json();
    if (!res.ok) throw new Error(parseApiError(data, "Ingest failed"));
    return data;
}

export async function sendChat(apiMode, sessionId, message) {
    const res = await fetch(`${API_BASE_URL}/${apiMode}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, message }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(parseApiError(data, "Chat failed"));
    return data;
}

export async function checkHealth() {
    const base = API_BASE_URL.replace(/\/api$/, "");
    const res = await fetch(`${base}/health`);
    return res.ok;
}
