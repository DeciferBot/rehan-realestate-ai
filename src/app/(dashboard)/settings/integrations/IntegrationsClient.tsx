"use client";

import { useState } from "react";
import { Stack, Row, Text, Card, CardHeader, CardBody, Badge, Field, Input, Button, IconButton } from "@/ui";
import { Check, Copy, ExternalLink } from "lucide-react";
import type { AdminProviderView } from "@/lib/integrations";

const CATEGORY: Record<string, string> = {
  ai: "AI", email: "Email", messaging: "Messaging", voice: "Voice", leadsource: "Lead source",
};

function statusBadge(p: AdminProviderView) {
  if (p.connected) return <Badge tone="success">Connected</Badge>;
  if (p.status === "active") return <Badge tone="warning">Needs key</Badge>;
  return <Badge tone="neutral">Not connected</Badge>;
}

export default function IntegrationsClient({
  initial,
  baseUrl,
}: {
  initial: AdminProviderView[];
  baseUrl: string;
}) {
  const [providers, setProviders] = useState(initial);
  const [edits, setEdits] = useState<Record<string, Record<string, string>>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  function fieldValue(p: AdminProviderView, key: string): string {
    return edits[p.id]?.[key] ?? p.values[key] ?? "";
  }
  function setField(pid: string, key: string, value: string) {
    setEdits((e) => ({ ...e, [pid]: { ...e[pid], [key]: value } }));
  }

  async function save(p: AdminProviderView) {
    setSaving(p.id);
    try {
      const config: Record<string, string> = {};
      for (const f of p.fields) config[f.key] = fieldValue(p, f.key);
      const res = await fetch("/api/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: p.id, config }),
      });
      const json = await res.json();
      if (json.ok) {
        setProviders(json.providers as AdminProviderView[]);
        setEdits((e) => ({ ...e, [p.id]: {} }));
        setSavedAt(p.id);
        setTimeout(() => setSavedAt((s) => (s === p.id ? null : s)), 2000);
      }
    } finally {
      setSaving((s) => (s === p.id ? null : s));
    }
  }

  function copy(text: string, id: string) {
    navigator.clipboard?.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied((c) => (c === id ? null : c)), 1500);
  }

  return (
    <Stack gap={8}>
      {providers.map((p) => {
        const webhook = p.webhookPath ? `${baseUrl}${p.webhookPath}` : null;
        return (
          <Card key={p.id} flush>
            <CardHeader>
              <Stack gap={1} grow>
                <Row gap={3}>
                  <Text size="md" weight="semibold">{p.label}</Text>
                  <Badge tone="neutral">{CATEGORY[p.category]}</Badge>
                </Row>
                <Text size="xs" tone="dim">{p.blurb}</Text>
              </Stack>
              {statusBadge(p)}
            </CardHeader>
            <CardBody>
              <Stack gap={6}>
                {p.fields.map((f) => (
                  <Field key={f.key} label={f.label} hint={f.help} htmlFor={`${p.id}-${f.key}`}>
                    <Input
                      id={`${p.id}-${f.key}`}
                      type={f.type === "secret" ? "password" : "text"}
                      autoComplete="off"
                      placeholder={f.placeholder}
                      value={fieldValue(p, f.key)}
                      onChange={(e) => setField(p.id, f.key, e.target.value)}
                    />
                  </Field>
                ))}

                {webhook && (
                  <Field label="Webhook URL" hint="Paste this into the provider's webhook setup.">
                    <Row gap={2}>
                      <Input readOnly value={webhook} onFocus={(e) => e.currentTarget.select()} style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)" }} />
                      <IconButton label="Copy webhook URL" onClick={() => copy(webhook, p.id)}>
                        {copied === p.id ? <Check size={14} /> : <Copy size={14} />}
                      </IconButton>
                    </Row>
                  </Field>
                )}

                <Row between wrap gap={3}>
                  <Row gap={3}>
                    <Button variant="primary" size="sm" loading={saving === p.id} onClick={() => save(p)}>
                      Save
                    </Button>
                    {savedAt === p.id && (
                      <Row gap={1}><Check size={13} className="u-tone-success" /><Text size="xs" tone="success">Saved</Text></Row>
                    )}
                  </Row>
                  {p.docsUrl && (
                    <a href={p.docsUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                      <Row gap={1}><Text size="xs" tone="dim">Where to find these</Text><ExternalLink size={12} className="u-tone-dim" /></Row>
                    </a>
                  )}
                </Row>
              </Stack>
            </CardBody>
          </Card>
        );
      })}
    </Stack>
  );
}
