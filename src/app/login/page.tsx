"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase/browser";
import { Loader2 } from "lucide-react";

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
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontSize: 12, color: "var(--dim)", letterSpacing: "0.02em" }}>Email</span>
        <input
          type="email"
          required
          autoFocus
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
      </label>

      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontSize: 12, color: "var(--dim)", letterSpacing: "0.02em" }}>Password</span>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
      </label>

      {error && (
        <div style={{ fontSize: 13, color: "var(--danger, #e5484d)", lineHeight: 1.4 }}>{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          marginTop: 4,
          height: 42,
          borderRadius: 9,
          border: "none",
          background: "var(--primary)",
          color: "white",
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: "-0.01em",
          cursor: loading ? "default" : "pointer",
          opacity: loading ? 0.7 : 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        {loading && <Loader2 size={15} className="spin" />}
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

const inputStyle: React.CSSProperties = {
  height: 42,
  borderRadius: 9,
  border: "1px solid var(--border)",
  background: "var(--surface, oklch(0.16 0 0))",
  color: "var(--ink)",
  padding: "0 13px",
  fontSize: 14,
  outline: "none",
  fontFamily: "var(--font-sans)",
};

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "oklch(0.105 0 0)",
      }}
    >
      <div style={{ width: "100%", maxWidth: 360 }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 28 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 9,
              background: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 17,
              fontWeight: 700,
              color: "white",
            }}
          >
            A
          </div>
          <div>
            <div style={{ color: "var(--ink)", fontWeight: 600, fontSize: 18, letterSpacing: "-0.02em", lineHeight: 1 }}>
              Acre
            </div>
            <div style={{ color: "var(--dim)", fontSize: 11, letterSpacing: "0.04em", marginTop: 3 }}>
              Command center
            </div>
          </div>
        </div>

        <h1 style={{ color: "var(--ink)", fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", margin: "0 0 4px" }}>
          Sign in
        </h1>
        <p style={{ color: "var(--dim)", fontSize: 13, margin: "0 0 24px", lineHeight: 1.5 }}>
          Access your leads, conversations, and AI agent.
        </p>

        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
