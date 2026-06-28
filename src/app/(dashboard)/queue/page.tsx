import { getQueue } from "@/lib/spine";
import Header from "@/components/Header";
import Link from "next/link";
import { Card, CardHeader, Row, Stack, Text, Badge } from "@/ui";
import { UserCog, BotOff, Clock, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Queue", description: "Leads assigned to human closers." };

const statusColor: Record<string, string> = {
  engaging: "#0ea5e9",
  qualified: "#8b5cf6",
  appointed: "#f59e0b",
};

function relativeTime(iso: string | null): string {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default async function QueuePage() {
  const items = await getQueue();

  return (
    <div>
      <Header
        title="Operator queue"
        subtitle="Escalated leads assigned to a human closer — waiting for action"
      />
      <div style={{ padding: "20px 28px" }}>
        {items.length === 0 ? (
          <Card style={{ padding: "var(--space-9)", textAlign: "center" }}>
            <Stack gap={3} align="center">
              <UserCog size={28} className="u-tone-dim" />
              <Text size="md" tone="dim">No leads in the queue.</Text>
              <Text size="sm" tone="dim">Escalated contacts will appear here once Acre qualifies and hands them off.</Text>
            </Stack>
          </Card>
        ) : (
          <Stack gap={3}>
            {items.map((item) => (
              <Link
                key={item.conversationId}
                href={`/inbox?c=${item.conversationId}`}
                style={{ textDecoration: "none" }}
              >
                <Card style={{ padding: "var(--space-5) var(--space-6)", cursor: "pointer" }}>
                  <Row gap={4} align="center">
                    <Text size="xl" style={{ flexShrink: 0 }}>{item.flag ?? "🌐"}</Text>
                    <Stack gap={1} style={{ flex: 1, minWidth: 0 }}>
                      <Row gap={3} align="center">
                        <Text size="md" weight="semibold">{item.contactName}</Text>
                        {item.aiPaused && (
                          <Row gap={1} align="center" style={{ display: "inline-flex" }}>
                            <BotOff size={11} style={{ color: "var(--warning, #d97706)" }} />
                            <Text size="2xs" style={{ color: "var(--warning, #d97706)", fontWeight: 600 }}>AI paused</Text>
                          </Row>
                        )}
                        <Badge
                          tone="neutral"
                          style={{
                            background: (statusColor[item.status] ?? "#6b7280") + "22",
                            color: statusColor[item.status] ?? "#6b7280",
                            border: `1px solid ${statusColor[item.status] ?? "#6b7280"}44`,
                            textTransform: "capitalize",
                          }}
                        >
                          {item.status}
                        </Badge>
                        {item.budget && (
                          <Text size="sm" weight="semibold" tone="accent" mono style={{ marginLeft: "auto" }}>
                            {item.budget}
                          </Text>
                        )}
                      </Row>
                      <Row gap={3} align="center">
                        <UserCog size={11} className="u-tone-dim" />
                        <Text size="sm" tone="dim">{item.assignedLabel?.replace("Human: ", "") ?? "Unassigned"}</Text>
                        <Text size="sm" tone="dim">·</Text>
                        <Clock size={11} className="u-tone-dim" />
                        <Text size="sm" tone="dim">{relativeTime(item.lastMessageAt)}</Text>
                      </Row>
                    </Stack>
                    <ArrowRight size={15} className="u-tone-dim" style={{ flexShrink: 0 }} />
                  </Row>
                </Card>
              </Link>
            ))}
          </Stack>
        )}
      </div>
    </div>
  );
}
