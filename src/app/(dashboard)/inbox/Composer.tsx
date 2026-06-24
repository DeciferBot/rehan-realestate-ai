"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, CornerUpLeft } from "lucide-react";
import { Row, Text, Textarea, Button } from "@/ui";

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
    <div className="u-composer">
      <Row gap={2}>
        <CornerUpLeft size={11} className="u-tone-dim" />
        <Text size="xs" tone="dim">
          Human take-over{channel ? ` · replying over ${channel}` : ""}
        </Text>
      </Row>
      <Row gap={3} align="flex-end">
        <Textarea
          className="u-grow"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send();
          }}
          placeholder="Type a reply… (⌘↵ to send)"
          rows={2}
        />
        <Button variant="primary" size="sm" loading={sending} disabled={!body.trim()} onClick={send} icon={<Send size={13} />}>
          {sending ? "Sending" : "Send"}
        </Button>
      </Row>
      {error && <Text size="xs" tone="primary">{error}</Text>}
    </div>
  );
}
