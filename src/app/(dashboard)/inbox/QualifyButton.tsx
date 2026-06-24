"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Gauge } from "lucide-react";
import { Row, Button, Text } from "@/ui";

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
    <Row gap={2}>
      {error && <Text size="xs" tone="primary">{error}</Text>}
      <Button variant="subtle" size="sm" loading={running} onClick={run} icon={<Gauge size={13} />}>
        {running ? "Assessing…" : "Assess"}
      </Button>
    </Row>
  );
}
