"use client";

import { useState } from "react";
import Link from "next/link";
import { getSupabaseBrowser } from "@/lib/supabase/browser";
import { Stack, Row, Text, Heading, Field, Input, Button } from "@/ui";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = getSupabaseBrowser();
    // The recovery link comes back through /auth/callback, which sets the
    // session and forwards to the page where the user picks a new password.
    const redirectTo = `${window.location.origin}/auth/callback?next=/auth/update-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
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

        {sent ? (
          <Stack gap={4}>
            <Heading as="h1" size="2xl" style={{ letterSpacing: "-0.02em" }}>Check your email</Heading>
            <Text as="p" size="base" tone="dim">
              If an account exists for <Text weight="medium">{email}</Text>, a password reset link is on its way. Open it on this device to set a new password.
            </Text>
            <Link href="/login" style={{ marginTop: "var(--space-1)" }}>
              <Text size="base" tone="primary">← Back to sign in</Text>
            </Link>
          </Stack>
        ) : (
          <>
            <Stack gap={2}>
              <Heading as="h1" size="2xl" style={{ letterSpacing: "-0.02em" }}>Reset password</Heading>
              <Text as="p" size="base" tone="dim">Enter your email and we&apos;ll send a link to set a new password.</Text>
            </Stack>

            <form onSubmit={onSubmit}>
              <Stack gap={6}>
                <Field label="Email" htmlFor="email">
                  <Input id="email" type="email" required autoFocus autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </Field>
                {error && <Text size="base" tone="primary">{error}</Text>}
                <Button type="submit" variant="primary" block loading={loading} style={{ marginTop: "var(--space-1)", height: 42 }}>
                  {loading ? "Sending…" : "Send reset link"}
                </Button>
                <div style={{ textAlign: "center" }}>
                  <Link href="/login">
                    <Text size="sm" tone="dim">← Back to sign in</Text>
                  </Link>
                </div>
              </Stack>
            </form>
          </>
        )}
      </Stack>
    </div>
  );
}
