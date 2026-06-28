"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Row, Button, Text } from "@/ui";

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
        if (json.error === "ai_paused") setError("AI is paused — resume to respond");
        else if (json.error === "not_configured") setError("Claude key not set");
        else setError("Agent failed");
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
    <Row gap={3}>
      {error && <Text size="xs" tone="primary">{error}</Text>}
      <Button variant="outline" size="sm" loading={running} onClick={run} icon={<Sparkles size={13} />}>
        {running ? "Agent thinking…" : "AI respond"}
      </Button>
    </Row>
  );
}
