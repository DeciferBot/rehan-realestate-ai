"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BotOff, Bot } from "lucide-react";

export default function PauseAIButton({
  conversationId,
  aiPaused,
}: {
  conversationId: string;
  aiPaused: boolean;
}) {
  const [paused, setPaused] = useState(aiPaused);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  async function toggle() {
    const next = !paused;
    setPaused(next);
    await fetch(`/api/conversations/${conversationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ai_paused: next }),
    });
    startTransition(() => router.refresh());
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      title={paused ? "Resume AI" : "Pause AI (take over)"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 12px",
        borderRadius: "var(--radius-md)",
        border: `1px solid ${paused ? "var(--warning-border, #f59e0b)" : "var(--border)"}`,
        background: paused ? "var(--warning-dim, #fef3c7)" : "var(--surface-2)",
        color: paused ? "var(--warning, #d97706)" : "var(--ink)",
        cursor: pending ? "wait" : "pointer",
        fontSize: 12,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {paused ? <BotOff size={13} /> : <Bot size={13} />}
      {paused ? "AI paused" : "Pause AI"}
    </button>
  );
}
