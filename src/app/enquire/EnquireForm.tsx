"use client";

import { useState } from "react";
import { Stack, Row, Text, Field, Input, Select, Textarea, Button } from "@/ui";
import { Check, ArrowRight } from "lucide-react";

const LANGS = ["English", "Arabic", "Hindi", "Urdu", "Russian", "Farsi", "French", "Mandarin"];
const BUDGETS = ["Under AED 1M", "AED 1M – 2M", "AED 2M – 5M", "AED 5M – 10M", "AED 10M+"];

type Form = { name: string; email: string; phone: string; language: string; budget: string; interest: string };

export default function EnquireForm() {
  const [form, setForm] = useState<Form>({ name: "", email: "", phone: "", language: "English", budget: "", interest: "" });
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          language: form.language,
          budget: form.budget,
          propertyInterest: form.interest,
          source: "Website",
          channel: "email",
          autoEngage: true,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "failed");
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <Stack gap={5} align="center" style={{ textAlign: "center", padding: "var(--space-9) 0" }}>
        <div className="topbar-avatar" style={{ width: 46, height: 46, background: "var(--success)" }}>
          <Check size={22} />
        </div>
        <Stack gap={2} align="center">
          <Text size="xl" weight="semibold">You&apos;re in, {form.name.split(" ")[0] || "thanks"}.</Text>
          <Text size="base" tone="dim" style={{ maxWidth: 340, lineHeight: 1.5 }}>
            Acre is reaching out to {form.email} now with options matched to your budget. Expect a reply shortly.
          </Text>
        </Stack>
      </Stack>
    );
  }

  return (
    <form onSubmit={submit}>
      <Stack gap={6}>
        <Field label="Full name" htmlFor="name">
          <Input id="name" required autoFocus value={form.name} onChange={set("name")} placeholder="Your name" />
        </Field>
        <Row gap={5} wrap style={{ alignItems: "flex-start" }}>
          <Field label="Email" htmlFor="email">
            <Input id="email" type="email" required value={form.email} onChange={set("email")} placeholder="you@email.com" style={{ minWidth: 0 }} />
          </Field>
          <Field label="Phone" htmlFor="phone">
            <Input id="phone" type="tel" value={form.phone} onChange={set("phone")} placeholder="+971 …" style={{ minWidth: 0 }} />
          </Field>
        </Row>
        <Row gap={5} wrap style={{ alignItems: "flex-start" }}>
          <Field label="Preferred language" htmlFor="language">
            <Select id="language" value={form.language} onChange={set("language")}>
              {LANGS.map((l) => <option key={l} value={l}>{l}</option>)}
            </Select>
          </Field>
          <Field label="Budget" htmlFor="budget">
            <Select id="budget" value={form.budget} onChange={set("budget")}>
              <option value="">Select budget</option>
              {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
            </Select>
          </Field>
        </Row>
        <Field label="What are you looking for?" hint="Area, bedrooms, ready vs off-plan — anything helps." htmlFor="interest">
          <Textarea id="interest" rows={3} value={form.interest} onChange={set("interest")} placeholder="e.g. 2BR in Dubai Marina, ready, for investment" />
        </Field>

        {state === "error" && <Text size="base" tone="primary">Something went wrong. Please try again.</Text>}

        <Button type="submit" variant="primary" block loading={state === "sending"} icon={state === "sending" ? undefined : <ArrowRight size={15} />} style={{ height: 44 }}>
          {state === "sending" ? "Sending…" : "Talk to Acre"}
        </Button>
        <Text size="xs" tone="dim" style={{ textAlign: "center" }}>
          Acre replies in your language, with real availability. No spam.
        </Text>
      </Stack>
    </form>
  );
}
