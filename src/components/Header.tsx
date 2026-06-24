"use client";
import { useState } from "react";
import { Search, Bell, Menu } from "lucide-react";
import { useSidebar } from "@/components/sidebar-context";
import { Row, Stack, Text } from "@/ui";

export default function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  const [query, setQuery] = useState("");
  const { setOpen } = useSidebar();

  return (
    <header className="header-pad u-topbar">
      {/* Title + mobile menu */}
      <Row gap={5} style={{ minWidth: 0 }}>
        <button className="menu-btn" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu size={17} strokeWidth={1.75} />
        </button>
        <Stack gap={1} style={{ minWidth: 0 }}>
          <Text as="div" size="lg" weight="semibold" truncate style={{ lineHeight: 1, letterSpacing: "-0.01em" }}>{title}</Text>
          {subtitle && <Text as="div" size="xs" tone="dim" truncate>{subtitle}</Text>}
        </Stack>
      </Row>

      {/* Right controls */}
      <Row gap={4}>
        <div className="header-search" style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <Search size={12} style={{ position: "absolute", left: "var(--space-5)", color: "var(--dim)", pointerEvents: "none" }} />
          <input
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search leads, properties..."
            style={{ width: 200, padding: "7px var(--space-5) 7px var(--space-10)" }}
          />
        </div>

        <button className="topbar-btn" aria-label="Notifications">
          <Bell size={14} strokeWidth={1.5} />
          <span className="topbar-btn__dot" />
        </button>

        <div style={{ width: 1, height: 24, background: "var(--border)" }} />

        <Row gap={3} style={{ cursor: "pointer" }}>
          <div className="topbar-avatar">R</div>
          <Stack gap={1}>
            <Text as="div" size="base" weight="medium" style={{ lineHeight: 1.1 }}>Simmer Properties</Text>
            <Text as="div" size="2xs" tone="dim">Admin</Text>
          </Stack>
        </Row>
      </Row>
    </header>
  );
}
