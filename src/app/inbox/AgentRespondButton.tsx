"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

export default function AgentRespondButton({ conversationId }: { conversationId: string }) {
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    if (running) return;
    setRunning(true);
    setError(null);
    try {
      const res = await fetch("/api/agent/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error === "not_configured" ? "Claude key not set" : "Agent failed");
        return;
      }
      router.refresh();
    } catch {
      setError("Agent failed");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {error && <span style={{ fontSize: 11, color: "var(--primary)" }}>{error}</span>}
      <button
        className="btn btn-sm"
        onClick={run}
        disabled={running}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "6px 12px", borderRadius: 7,
          background: "var(--primary-dim)", border: "1px solid var(--primary-border)",
          color: "var(--primary)", fontWeight: 500,
          opacity: running ? 0.6 : 1,
        }}
      >
        <Sparkles size={13} />
        {running ? "Agent thinking…" : "AI respond"}
      </button>
    </div>
  );
}
