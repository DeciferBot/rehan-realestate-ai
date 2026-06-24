"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase/browser";
import { Stack, Row, Text, Heading, Field, Input, Button } from "@/ui";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    // Full navigation so middleware re-reads the fresh session cookie.
    router.replace(next);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit}>
      <Stack gap={6}>
        <Field label="Email" htmlFor="email">
          <Input id="email" type="email" required autoFocus autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Password" htmlFor="password">
          <Input id="password" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        {error && <Text size="base" tone="primary">{error}</Text>}
        <Button type="submit" variant="primary" block loading={loading} style={{ marginTop: "var(--space-1)", height: 42 }}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </Stack>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="login-screen">
      <Stack gap={7} style={{ width: "100%", maxWidth: 360 }}>
        <Row gap={3}>
          <div className="topbar-avatar" style={{ width: 38, height: 38, fontSize: "var(--text-lg)" }}>A</div>
          <Stack gap={1}>
            <Text as="div" size="xl" weight="semibold" style={{ letterSpacing: "-0.02em" }}>Acre</Text>
            <Text as="div" size="xs" tone="dim" style={{ letterSpacing: "0.04em" }}>Command center</Text>
          </Stack>
        </Row>

        <Stack gap={2}>
          <Heading as="h1" size="2xl" style={{ letterSpacing: "-0.02em" }}>Sign in</Heading>
          <Text as="p" size="base" tone="dim">Access your leads, conversations, and AI agent.</Text>
        </Stack>

        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </Stack>
    </div>
  );
}
