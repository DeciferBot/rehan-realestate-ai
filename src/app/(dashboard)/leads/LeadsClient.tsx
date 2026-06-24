"use client";
import { useState } from "react";
import Header from "@/components/Header";
import type { Lead } from "@/lib/data";
import {
  Phone, Filter, Search, Download, Plus,
  TrendingUp, Home, MessageSquare, CalendarPlus, UserCheck,
} from "lucide-react";
import {
  Stack, Row, Text, Card, Badge, StatusDot, Button, Input, Chip,
} from "@/ui";

const statusConfig: Record<string, { label: string; tone: "neutral" | "primary" | "accent" | "success" | "warning" | "info" | "purple" }> = {
  new:       { label: "New",       tone: "accent"  },
  calling:   { label: "Calling",   tone: "primary" },
  called:    { label: "Called",    tone: "info"    },
  qualified: { label: "Qualified", tone: "purple"  },
  appointed: { label: "Appointed", tone: "warning" },
  closed:    { label: "Closed",    tone: "success" },
};

export default function LeadsClient({ leads }: { leads: Lead[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter]     = useState("all");
  const [search, setSearch]     = useState("");

  const filtered = leads.filter(l =>
    (filter === "all" || l.status === filter) &&
    (l.name.toLowerCase().includes(search.toLowerCase()) || l.phone.includes(search))
  );
  const selectedLead = leads.find(l => l.id === selected);

  return (
    <div>
      <Header title="Lead Management" subtitle="Incoming leads from Meta & Instagram advertising" />
      <Stack gap={5} style={{ padding: "var(--space-9) 28px" }}>

        {/* Toolbar */}
        <Row gap={3} wrap between align="center">
          <Row gap={2} wrap>
            {["all", "new", "calling", "called", "qualified", "appointed", "closed"].map(f => (
              <Chip key={f} on={filter === f} onClick={() => setFilter(f)}>
                {f === "all" ? "All leads" : statusConfig[f]?.label || f}
              </Chip>
            ))}
          </Row>
          <Row gap={3}>
            <Row align="center" style={{ position: "relative" }}>
              <Search size={12} style={{ position: "absolute", left: 10, color: "var(--dim)", pointerEvents: "none" }} />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search leads..."
                style={{ paddingLeft: 30, width: 180 }}
              />
            </Row>
            <Button variant="outline" size="sm" icon={<Plus size={13} />}>New lead</Button>
            <Button variant="ghost" size="sm" icon={<Download size={13} />} />
          </Row>
        </Row>

        <Row gap={5} align="flex-start">

          {/* Table */}
          <Card flush className="panel-lg" style={{ flex: 1, overflow: "hidden" }}>
            <table className="data-table">
              <thead>
                <tr>
                  {["Lead", "Contact", "Language", "Status", "Interest", "Type", "Agent", "Budget"].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => {
                  const sc = statusConfig[lead.status] || statusConfig.new;
                  const isActive = selected === lead.id;
                  return (
                    <tr key={lead.id} onClick={() => setSelected(isActive ? null : lead.id)} className={isActive ? "selected" : ""}>
                      <td>
                        <Text size="sm" weight="medium" tone="ink" as="div">{lead.name}</Text>
                        <Text size="xs" tone="dim" as="div">{lead.time}</Text>
                      </td>
                      <td><Text size="sm" tone="muted">{lead.phone}</Text></td>
                      <td><Text size="sm" tone="muted">{lead.language}</Text></td>
                      <td>
                        <Row gap={2} align="center">
                          {lead.status === "calling" && <StatusDot state="live" />}
                          <Badge tone={sc.tone}>{sc.label}</Badge>
                        </Row>
                      </td>
                      <td style={{ maxWidth: 140 }}>
                        <Text size="sm" tone="muted" truncate as="div">{lead.propertyInterest}</Text>
                      </td>
                      <td>
                        <Badge tone={lead.investType === "investment" ? "purple" : "info"}>
                          {lead.investType === "investment"
                            ? <><TrendingUp size={10} />Invest</>
                            : <><Home size={10} />Live-in</>}
                        </Badge>
                      </td>
                      <td><Text size="sm" tone="muted">{lead.assignedAgent}</Text></td>
                      <td>
                        <Text mono tone="accent" weight="semibold">{lead.budget}</Text>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>

          {/* Detail panel */}
          {selectedLead && (
            <Card pad className="panel-lg slide-in-right" style={{ width: 272, flexShrink: 0 }}>
              <Stack gap={5}>
                <Stack gap={1}>
                  <Text size="lg" weight="semibold" tone="ink" as="div">{selectedLead.name}</Text>
                  <Text size="xs" tone="dim" as="div">{selectedLead.id} · {selectedLead.source}</Text>
                </Stack>
                <Stack gap={3}>
                  {[
                    { label: "Phone",    value: selectedLead.phone },
                    { label: "Language", value: selectedLead.language },
                    { label: "Budget",   value: selectedLead.budget, accent: true },
                    { label: "Interest", value: selectedLead.propertyInterest },
                    { label: "Type",     value: selectedLead.investType === "investment" ? "Investment" : "Live-in" },
                    { label: "Agent",    value: selectedLead.assignedAgent },
                  ].map(({ label, value, accent }) => (
                    <Row key={label} gap={3} between>
                      <Text size="xs" tone="dim">{label}</Text>
                      <Text size="xs" weight="medium" tone={accent ? "accent" : "ink"} style={{ textAlign: "right" }}>{value}</Text>
                    </Row>
                  ))}
                </Stack>
                <Stack gap={2}>
                  <Button variant="primary" size="sm" block icon={<Phone size={13} />}>Initiate AI call</Button>
                  <Button variant="ghost" size="sm" block icon={<MessageSquare size={13} />}>Send WhatsApp</Button>
                  <Button variant="ghost" size="sm" block icon={<CalendarPlus size={13} />}>Book appointment</Button>
                  <Button variant="ghost" size="sm" block icon={<UserCheck size={13} />}>Escalate to human</Button>
                </Stack>
              </Stack>
            </Card>
          )}
        </Row>

        <Row between align="center">
          <Text size="xs" tone="dim">Showing {filtered.length} of {leads.length} leads</Text>
          <Row gap={2} align="center">
            <Filter size={11} className="u-tone-dim" />
            <Text size="xs" tone="dim">Click any row to view details</Text>
          </Row>
        </Row>
      </Stack>
    </div>
  );
}
