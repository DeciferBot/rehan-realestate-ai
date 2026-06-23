"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AgentConfig, TenantInfo } from "@/lib/admin";
import { Bot, Save, Check, Globe, Phone, MessageSquare, Mail, X, Plus, Building2, Users, Layers } from "lucide-react";

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

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer",
        background: active ? "var(--primary-dim)" : "var(--surface-2)",
        border: `1px solid ${active ? "var(--primary-border)" : "var(--border)"}`,
        color: active ? "var(--primary)" : "var(--muted)",
      }}
    >
      {children}
    </button>
  );
}

function TagInput({ tags, setTags, placeholder }: { tags: string[]; setTags: (t: string[]) => void; placeholder: string }) {
  const [val, setVal] = useState("");
  const add = () => {
    const v = val.trim();
    if (v && !tags.includes(v)) setTags([...tags, v]);
    setVal("");
  };
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
      {tags.map((t) => (
        <span key={t} style={{
          display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 9px", borderRadius: 7,
          background: "var(--surface-2)", border: "1px solid var(--border)", fontSize: 12, color: "var(--ink)",
        }}>
          {t}
          <X size={11} style={{ cursor: "pointer", color: "var(--dim)" }} onClick={() => setTags(tags.filter((x) => x !== t))} />
        </span>
      ))}
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
        <input
          className="search-input"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } }}
          placeholder={placeholder}
          style={{ width: 150, padding: "6px 10px" }}
        />
        <button type="button" className="btn btn-ghost btn-sm" onClick={add}><Plus size={12} /></button>
      </span>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{label}</div>
        {hint && <div style={{ fontSize: 11, color: "var(--dim)", marginTop: 2 }}>{hint}</div>}
      </div>
      {children}
    </div>
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

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "9px 12px", fontSize: 13, color: "var(--ink)",
    background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8,
  };

  return (
    <div style={{ padding: "24px 28px", maxWidth: 760 }}>
      {/* Tenant card */}
      <div className="panel-lg" style={{ padding: 18, marginBottom: 20, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10, background: "var(--primary)",
          display: "flex", alignItems: "center", justifyContent: "center", color: "white", flexShrink: 0,
        }}>
          <Bot size={22} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{tenant.name}</div>
          <div style={{ fontSize: 12, color: "var(--dim)" }}>Tenant · {tenant.slug}</div>
        </div>
        <div style={{ display: "flex", gap: 18 }}>
          {[
            { icon: <Users size={13} />, n: tenant.contacts, l: "leads" },
            { icon: <Building2 size={13} />, n: tenant.projects, l: "projects" },
            { icon: <Layers size={13} />, n: tenant.units, l: "units" },
          ].map((s) => (
            <div key={s.l} style={{ textAlign: "center" }}>
              <div className="mono" style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)" }}>{s.n}</div>
              <div style={{ fontSize: 10, color: "var(--dim)", display: "flex", alignItems: "center", gap: 3, justifyContent: "center" }}>{s.icon}{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel-lg" style={{ padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>Agent configuration</div>
          <button type="button" onClick={() => setActive(!active)}
            className={`badge ${active ? "badge-success" : "badge-muted"}`}
            style={{ cursor: "pointer", padding: "4px 10px" }}>
            {active ? "● Active" : "○ Inactive"}
          </button>
        </div>

        <Field label="Agent name">
          <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} />
        </Field>

        <Field label="Model" hint="Which Claude model powers this tenant's agent.">
          <select style={inputStyle} value={model} onChange={(e) => setModel(e.target.value)}>
            {MODEL_OPTIONS.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
          </select>
        </Field>

        <Field label="Languages" hint="The agent replies in the lead's language.">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {LANG_OPTIONS.map((l) => (
              <Chip key={l} active={languages.includes(l)} onClick={() => toggle(languages, setLanguages, l)}>
                <Globe size={12} />{l}
              </Chip>
            ))}
          </div>
        </Field>

        <Field label="Channels" hint="Where this agent engages leads. Each is a pluggable adapter.">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {CHANNELS.map((c) => (
              <Chip key={c.key} active={channels.includes(c.key)} onClick={() => toggle(channels, setChannels, c.key)}>
                {c.icon}{c.label}{c.note && <span style={{ fontSize: 10, opacity: 0.7 }}>· {c.note}</span>}
              </Chip>
            ))}
          </div>
        </Field>

        <Field label="Persona" hint="One line on how the agent should come across.">
          <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 56, lineHeight: 1.5 }} value={persona} onChange={(e) => setPersona(e.target.value)} />
        </Field>

        <Field label="System prompt" hint="The core instructions the agent follows on every turn.">
          <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 130, lineHeight: 1.5, fontFamily: "var(--font-mono, monospace)", fontSize: 12.5 }} value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} />
        </Field>

        <Field label="Qualification — capture" hint="What the agent works to learn from every lead.">
          <TagInput tags={capture} setTags={setCapture} placeholder="add field…" />
        </Field>

        <Field label="Escalation rules" hint="When the agent hands the lead to a human closer.">
          <TagInput tags={escalateWhen} setTags={setEscalateWhen} placeholder="add condition…" />
        </Field>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
          <button className="btn btn-primary" onClick={save} disabled={saving} style={{ opacity: saving ? 0.6 : 1 }}>
            {saved ? <Check size={14} /> : <Save size={14} />}{saved ? "Saved" : saving ? "Saving…" : "Save changes"}
          </button>
          {error && <span style={{ fontSize: 12, color: "var(--primary)" }}>{error}</span>}
        </div>
      </div>
    </div>
  );
}
