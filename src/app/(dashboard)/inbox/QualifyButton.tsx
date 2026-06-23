"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Gauge } from "lucide-react";

export default function QualifyButton({ conversationId }: { conversationId: string }) {
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    if (running) return;
    setRunning(true);
    setError(null);
    try {
      const res = await fetch("/api/agent/qualify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error === "not_configured" ? "Claude key not set" : "Failed");
        return;
      }
      router.refresh();
    } catch {
      setError("Failed");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {error && <span style={{ fontSize: 11, color: "var(--primary)" }}>{error}</span>}
      <button
        className="btn btn-sm"
        onClick={run}
        disabled={running}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "6px 12px", borderRadius: 7,
          background: "var(--surface-2)", border: "1px solid var(--border)",
          color: "var(--muted)", fontWeight: 500, opacity: running ? 0.6 : 1,
        }}
      >
        <Gauge size={13} />
        {running ? "Assessing…" : "Assess"}
      </button>
    </div>
  );
}
