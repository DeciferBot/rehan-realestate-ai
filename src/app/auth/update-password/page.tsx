"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabaseBrowser } from "@/lib/supabase/browser";
import { Stack, Row, Text, Heading, Field, Input, Button } from "@/ui";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // The /auth/callback route exchanged the recovery code for a session before
  // forwarding here, so a valid recovery is already signed in. If there is no
  // session the user reached this page without a fresh link — send them back.
  useEffect(() => {
    const supabase = getSupabaseBrowser();
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(Boolean(data.session));
      setChecking(false);
    });
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError(null);
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    // Full navigation so middleware re-reads the fresh session cookie.
    router.replace("/console");
    router.refresh();
  }

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

        {checking ? (
          <Text size="base" tone="dim">Verifying your link…</Text>
        ) : !hasSession ? (
          <Stack gap={4}>
            <Heading as="h1" size="2xl" style={{ letterSpacing: "-0.02em" }}>Link expired</Heading>
            <Text as="p" size="base" tone="dim">
              This password reset link is invalid or has already been used. Request a fresh one to continue.
            </Text>
            <Link href="/login/forgot" style={{ marginTop: "var(--space-1)" }}>
              <Text size="base" tone="primary">Request a new link →</Text>
            </Link>
          </Stack>
        ) : (
          <>
            <Stack gap={2}>
              <Heading as="h1" size="2xl" style={{ letterSpacing: "-0.02em" }}>Set a new password</Heading>
              <Text as="p" size="base" tone="dim">Choose a new password for your command center.</Text>
            </Stack>

            <form onSubmit={onSubmit}>
              <Stack gap={6}>
                <Field label="New password" htmlFor="password">
                  <Input id="password" type="password" required autoFocus autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </Field>
                <Field label="Confirm password" htmlFor="confirm">
                  <Input id="confirm" type="password" required autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                </Field>
                {error && <Text size="base" tone="primary">{error}</Text>}
                <Button type="submit" variant="primary" block loading={loading} style={{ marginTop: "var(--space-1)", height: 42 }}>
                  {loading ? "Saving…" : "Update password"}
                </Button>
              </Stack>
            </form>
          </>
        )}
      </Stack>
    </div>
  );
}
