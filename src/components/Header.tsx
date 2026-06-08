"use client";
import { useState } from "react";
import { Search, Bell } from "lucide-react";

export default function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  const [query, setQuery] = useState("");

  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 30,
      background: "var(--bg)",
      borderBottom: "1px solid var(--border)",
      height: "var(--header-h)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 28px",
    }}>

      {/* Title */}
      <div>
        <h1 style={{
          fontSize: 15,
          fontWeight: 600,
          color: "var(--ink)",
          lineHeight: 1,
          letterSpacing: "-0.01em",
          fontFamily: "var(--font-sans)",
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{
            fontSize: 11,
            color: "var(--dim)",
            marginTop: 3,
            fontFamily: "var(--font-sans)",
          }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Right controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

        {/* Search */}
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <Search
            size={12}
            style={{
              position: "absolute",
              left: 11,
              color: "var(--dim)",
              pointerEvents: "none",
            }}
          />
          <input
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search leads, properties..."
            style={{ width: 200, padding: "7px 12px 7px 30px" }}
          />
        </div>

        {/* Notifications */}
        <button style={{
          width: 34, height: 34,
          borderRadius: 8,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
          position: "relative",
          color: "var(--muted)",
          transition: "background 0.15s ease",
        }}>
          <Bell size={14} strokeWidth={1.5} />
          <span style={{
            position: "absolute",
            top: 8, right: 8,
            width: 5, height: 5,
            borderRadius: "50%",
            background: "var(--primary)",
          }} />
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 24, background: "var(--border)" }} />

        {/* User */}
        <div style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }}>
          <div style={{
            width: 30, height: 30,
            borderRadius: 7,
            background: "var(--primary)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, color: "white",
          }}>
            R
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", lineHeight: 1.1 }}>Rehan</div>
            <div style={{ fontSize: 10, color: "var(--dim)" }}>Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
}
