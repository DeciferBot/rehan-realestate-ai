"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, CornerUpLeft } from "lucide-react";
import { Row, Text, Textarea, Button, Chip } from "@/ui";

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
  const isEmail = channel === "email";
  // For email conversations, real delivery is opt-in so testing the agent in
  // the dashboard never emails the contact one line at a time.
  const [deliver, setDeliver] = useState(false);

  async function send() {
    const text = body.trim();
    if (!text || sending) return;
    setSending(true);
    setError(null);
    const willDeliver = isEmail && deliver;
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, body: text, deliver: willDeliver }),
      });
      if (!res.ok) throw new Error("send_failed");
      setBody("");
      router.refresh();
      // Trigger agent reply in the background — don't await, refresh again when done
      fetch("/api/agent/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, deliver: willDeliver }),
      }).then((r) => r.json()).then((json) => {
        if (json.ok) router.refresh();
      }).catch(() => {/* silent — agent may not be configured */});
    } catch {
      setError("Couldn't send — try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="u-composer">
      <Row gap={2} align="center">
        <CornerUpLeft size={11} className="u-tone-dim" />
        <Text size="xs" tone="dim">
          Human take-over{channel ? ` · ${channel}` : ""}
        </Text>
        {isEmail && (
          <Chip on={deliver} onClick={() => setDeliver((d) => !d)} title="When on, your reply and the AI reply are emailed to the contact. When off, messages stay in this thread for testing.">
            {deliver ? "Delivering over email" : "Test mode · no email"}
          </Chip>
        )}
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
