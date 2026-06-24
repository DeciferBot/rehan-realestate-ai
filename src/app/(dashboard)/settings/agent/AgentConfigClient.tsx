"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AgentConfig, TenantInfo } from "@/lib/admin";
import { Bot, Save, Check, Globe, Phone, MessageSquare, Mail, X, Plus, Building2, Users, Layers } from "lucide-react";
import {
  Stack, Row, Text, Heading, Card, CardHeader, CardBody,
  Badge, StatusDot, Field, Input, Textarea, Select, Chip, Button, IconButton,
} from "@/ui";

const LANG_OPTIONS = ["Arabic", "English", "Hindi", "Russian", "Mandarin", "Urdu", "French", "Spanish"];
const MODEL_OPTIONS = [
  { id: "claude-opus-4-8", label: "Claude Opus 4.8 — most capable" },
  { id: "claude-sonnet-4-6", label: "Claude Sonnet 4.6 — fast & balanced" },
  { id: "claude-haiku-4-5", label: "Claude Haiku 4.5 — fastest" },
];
const CHANNELS = [
  { key: "voice", label: "Voice", icon: <Phone size={13} />, note: "deferred" },
  { key: "whatsapp", label: "WhatsApp", icon: <MessageSquare size={13} /> },
  { key: "email", label: "Email", icon: <Mail size={13} /> },
];

function TagInput({ tags, setTags, placeholder }: { tags: string[]; setTags: (t: string[]) => void; placeholder: string }) {
  const [val, setVal] = useState("");
  const add = () => {
    const v = val.trim();
    if (v && !tags.includes(v)) setTags([...tags, v]);
    setVal("");
  };
  return (
    <Row gap={3} wrap align="center">
      {tags.map((t) => (
        <Chip key={t} on>
          <Text size="xs">{t}</Text>
          <IconButton label={`Remove ${t}`} onClick={() => setTags(tags.filter((x) => x !== t))}>
            <X size={11} />
          </IconButton>
        </Chip>
      ))}
      <Row gap={2} align="center">
        <Input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } }}
          placeholder={placeholder}
          style={{ width: "10rem" }}
        />
        <Button variant="ghost" size="sm" onClick={add} icon={<Plus size={12} />} />
      </Row>
    </Row>
  );
}

export default function AgentConfigClient({ config, tenant }: { config: AgentConfig; tenant: TenantInfo }) {
  const router = useRouter();
  const [name, setName] = useState(config.name);
  const [model, setModel] = useState(config.model);
  const [active, setActive] = useState(config.active);
  const [languages, setLanguages] = useState<string[]>(config.languages);
  const [channels, setChannels] = useState<string[]>(config.channels);
  const [persona, setPersona] = useState(config.persona);
  const [systemPrompt, setSystemPrompt] = useState(config.systemPrompt);
  const [capture, setCapture] = useState<string[]>(config.capture);
  const [escalateWhen, setEscalateWhen] = useState<string[]>(config.escalateWhen);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = (list: string[], setList: (v: string[]) => void, v: string) =>
    setList(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  async function save() {
    setSaving(true); setSaved(false); setError(null);
    try {
      const res = await fetch("/api/agent-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: config.id, name, model, active, languages, channels, persona, systemPrompt, capture, escalateWhen }),
      });
      if (!res.ok) throw new Error("save_failed");
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Couldn't save — try again.");
    } finally {
      setSaving(false);
    }
  }

  const stats = [
    { icon: <Users size={13} />, n: tenant.contacts, l: "leads" },
    { icon: <Building2 size={13} />, n: tenant.projects, l: "projects" },
    { icon: <Layers size={13} />, n: tenant.units, l: "units" },
  ];

  return (
    <Stack gap={8} style={{ padding: "var(--space-9) var(--space-9)", maxWidth: "47.5rem" }}>
      {/* Tenant card */}
      <Card pad>
        <Row gap={7} align="center">
          <div
            style={{
              width: "2.75rem", height: "2.75rem", borderRadius: "var(--radius-4)", background: "var(--primary)",
              display: "flex", alignItems: "center", justifyContent: "center", color: "white", flexShrink: 0,
            }}
          >
            <Bot size={22} />
          </div>
          <Stack gap={1} className="u-grow">
            <Text size="lg" weight="semibold">{tenant.name}</Text>
            <Text size="xs" tone="dim">Tenant · {tenant.slug}</Text>
          </Stack>
          <Row gap={8}>
            {stats.map((s) => (
              <Stack key={s.l} gap={1} style={{ alignItems: "center", textAlign: "center" }}>
                <Text size="lg" weight="bold" mono>{s.n}</Text>
                <Row gap={1} align="center">{s.icon}<Text size="2xs" tone="dim">{s.l}</Text></Row>
              </Stack>
            ))}
          </Row>
        </Row>
      </Card>

      <Card>
        <CardHeader>
          <Row between align="center">
            <Heading size="md" as="h2">Agent configuration</Heading>
            <button
              type="button"
              onClick={() => setActive(!active)}
              style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
            >
              <Badge tone={active ? "success" : "neutral"}>
                <StatusDot state={active ? "live" : "idle"} />
                {active ? "Active" : "Inactive"}
              </Badge>
            </button>
          </Row>
        </CardHeader>
        <CardBody>
          <Stack gap={8}>
            <Field label="Agent name">
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </Field>

            <Field label="Model" hint="Which Claude model powers this tenant's agent.">
              <Select value={model} onChange={(e) => setModel(e.target.value)}>
                {MODEL_OPTIONS.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
              </Select>
            </Field>

            <Field label="Languages" hint="The agent replies in the lead's language.">
              <Row gap={4} wrap>
                {LANG_OPTIONS.map((l) => (
                  <Chip key={l} on={languages.includes(l)} onClick={() => toggle(languages, setLanguages, l)}>
                    <Globe size={12} />{l}
                  </Chip>
                ))}
              </Row>
            </Field>

            <Field label="Channels" hint="Where this agent engages leads. Each is a pluggable adapter.">
              <Row gap={4} wrap>
                {CHANNELS.map((c) => (
                  <Chip key={c.key} on={channels.includes(c.key)} onClick={() => toggle(channels, setChannels, c.key)}>
                    {c.icon}{c.label}{c.note && <Text size="2xs" tone="dim">· {c.note}</Text>}
                  </Chip>
                ))}
              </Row>
            </Field>

            <Field label="Persona" hint="One line on how the agent should come across.">
              <Textarea value={persona} onChange={(e) => setPersona(e.target.value)} />
            </Field>

            <Field label="System prompt" hint="The core instructions the agent follows on every turn.">
              <Textarea
                className="u-text--mono"
                style={{ minHeight: "8rem" }}
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
              />
            </Field>

            <Field label="Qualification — capture" hint="What the agent works to learn from every lead.">
              <TagInput tags={capture} setTags={setCapture} placeholder="add field…" />
            </Field>

            <Field label="Escalation rules" hint="When the agent hands the lead to a human closer.">
              <TagInput tags={escalateWhen} setTags={setEscalateWhen} placeholder="add condition…" />
            </Field>

            <Row gap={6} align="center">
              <Button variant="primary" onClick={save} loading={saving} icon={saved ? <Check size={14} /> : <Save size={14} />}>
                {saved ? "Saved" : saving ? "Saving…" : "Save changes"}
              </Button>
              {error && <Text size="xs" tone="primary">{error}</Text>}
            </Row>
          </Stack>
        </CardBody>
      </Card>
    </Stack>
  );
}
