"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, CornerUpLeft } from "lucide-react";

export default function Composer({
  conversationId,
  channel,
}: {
  conversationId: string;
  channel: string | null;
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send() {
    const text = body.trim();
    if (!text || sending) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, body: text }),
      });
      if (!res.ok) throw new Error("send_failed");
      setBody("");
      router.refresh();
    } catch {
      setError("Couldn't send — try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ borderTop: "1px solid var(--border)", padding: "12px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <CornerUpLeft size={11} style={{ color: "var(--dim)" }} />
        <span style={{ fontSize: 11, color: "var(--dim)" }}>
          Human take-over{channel ? ` · replying over ${channel}` : ""}
        </span>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
        <textarea
          className="search-input"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send();
          }}
          placeholder="Type a reply… (⌘↵ to send)"
          rows={2}
          style={{ flex: 1, resize: "none", paddingTop: 8, paddingBottom: 8, lineHeight: 1.4 }}
        />
        <button
          className="btn btn-primary btn-sm"
          onClick={send}
          disabled={sending || !body.trim()}
          style={{ justifyContent: "center", opacity: sending || !body.trim() ? 0.6 : 1 }}
        >
          <Send size={13} />
          {sending ? "Sending" : "Send"}
        </button>
      </div>
      {error && <div style={{ fontSize: 11, color: "var(--primary)", marginTop: 6 }}>{error}</div>}
    </div>
  );
}
