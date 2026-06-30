"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getSupabaseBrowser } from "@/lib/supabase/browser";
import { Stack, Row, Text, Heading, Field, Input, Button } from "@/ui";

type Mode = "password" | "magic";

// Friendly copy for errors bounced back from /auth/callback.
function callbackErrorMessage(code: string | null): string | null {
  switch (code) {
    case "link_expired":
      return "That link has expired or was already used. Request a new one below.";
    case "link_invalid":
      return "That sign-in link was invalid. Try again below.";
    default:
      return null;
  }
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";

  const [mode, setMode] = useState<Mode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(callbackErrorMessage(params.get("error")));
  const [magicSent, setMagicSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = getSupabaseBrowser();

    if (mode === "magic") {
      const emailRedirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
      const { error } = await supabase.auth.signInWithOtp({
        email,
        // Don't let an unknown email self-provision an account on the console.
        options: { emailRedirectTo, shouldCreateUser: false },
      });
      setLoading(false);
      if (error) {
        setError(error.message);
        return;
      }
      setMagicSent(true);
      return;
    }

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

  if (magicSent) {
    return (
      <Stack gap={4}>
        <Heading as="h2" size="xl" style={{ letterSpacing: "-0.02em" }}>Check your email</Heading>
        <Text as="p" size="base" tone="dim">
          If an account exists for <Text weight="medium">{email}</Text>, a sign-in link is on its way. Open it on this device to continue.
        </Text>
        <button
          type="button"
          className="u-text u-sm u-tone-primary"
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
          onClick={() => setMagicSent(false)}
        >
          ← Use a different method
        </button>
      </Stack>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <Stack gap={6}>
        <Field label="Email" htmlFor="email">
          <Input id="email" type="email" required autoFocus autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>

        {mode === "password" && (
          <Stack gap={2}>
            <Field label="Password" htmlFor="password">
              <Input id="password" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Field>
            <div style={{ textAlign: "right" }}>
              <Link href="/login/forgot">
                <Text size="sm" tone="primary">Forgot password?</Text>
              </Link>
            </div>
          </Stack>
        )}

        {error && <Text size="base" tone="primary">{error}</Text>}

        <Button type="submit" variant="primary" block loading={loading} style={{ marginTop: "var(--space-1)", height: 42 }}>
          {loading
            ? mode === "magic" ? "Sending…" : "Signing in…"
            : mode === "magic" ? "Email me a magic link" : "Sign in"}
        </Button>

        <div style={{ textAlign: "center" }}>
          <button
            type="button"
            className="u-text u-sm u-tone-dim"
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
            onClick={() => {
              setError(null);
              setMode((m) => (m === "password" ? "magic" : "password"));
            }}
          >
            {mode === "password" ? "Sign in with a magic link instead" : "Sign in with a password instead"}
          </button>
        </div>
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
