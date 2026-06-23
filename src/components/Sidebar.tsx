"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase/browser";
import { useSidebar } from "@/components/sidebar-context";
import {
  LayoutDashboard, Users, Building2, Phone, Calendar,
  FolderOpen, Settings, LogOut, Inbox, Bot, Layers,
} from "lucide-react";

const navItems = [
  { href: "/console",       label: "Dashboard",     icon: LayoutDashboard },
  { href: "/inbox",         label: "Conversations", icon: Inbox },
  { href: "/leads",         label: "Leads",         icon: Users },
  { href: "/properties",    label: "Properties",    icon: Building2 },
  { href: "/agent-console", label: "Agent Console", icon: Phone },
  { href: "/appointments",  label: "Appointments",  icon: Calendar },
  { href: "/developers",    label: "Developers",    icon: FolderOpen },
  { href: "/settings/inventory", label: "Inventory", icon: Layers },
  { href: "/settings/agent", label: "Agent Setup",  icon: Bot },
];

const agents = [
  { name: "Alpha", delay: "0s" },
  { name: "Beta",  delay: "0.4s" },
  { name: "Gamma", delay: "0.8s" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { open, setOpen } = useSidebar();

  async function signOut() {
    setOpen(false);
    await getSupabaseBrowser().auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <aside className={`app-sidebar${open ? " open" : ""}`} style={{
      position: "fixed",
      left: 0, top: 0,
      width: "var(--sidebar-w)",
      height: "100dvh",
      background: "oklch(0.105 0.000 0)",
      borderRight: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      zIndex: 40,
    }}>

      {/* App mark */}
      <div style={{
        padding: "20px 16px 16px",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{
            width: 30, height: 30,
            background: "var(--primary)",
            borderRadius: 7,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            fontSize: 13, fontWeight: 700, color: "white",
            fontFamily: "var(--font-sans)",
            letterSpacing: "-0.01em",
          }}>R</div>
          <div>
            <div style={{ color: "var(--ink)", fontWeight: 600, fontSize: 14, lineHeight: 1.1, letterSpacing: "-0.01em" }}>
              Rehan
            </div>
            <div style={{ color: "var(--dim)", fontSize: 10, letterSpacing: "0.06em", marginTop: 2 }}>
              Real Estate AI
            </div>
          </div>
        </div>

        {/* System status */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "7px 10px",
          background: "var(--success-dim)",
          border: "1px solid var(--success-border)",
          borderRadius: 7,
        }}>
          <span className="live-dot live-dot-green" />
          <span style={{ fontSize: 12, color: "var(--success)", fontWeight: 500 }}>3 agents live</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
            {agents.map((a) => (
              <div key={a.name} title={`Agent ${a.name}`} style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "var(--success)",
                animation: `live-pulse 2s ease-in-out ${a.delay} infinite`,
                opacity: 0.8,
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>
        <div className="section-label" style={{ padding: "0 12px", marginBottom: 8 }}>
          Navigation
        </div>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} onClick={() => setOpen(false)} className={`nav-item${active ? " active" : ""}`}>
              <Icon size={15} strokeWidth={active ? 2 : 1.5} style={{ flexShrink: 0 }} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: "8px 8px 12px", borderTop: "1px solid var(--border)" }}>
        <Link href="/settings/agent" className="nav-item" style={{ cursor: "pointer" }}>
          <Settings size={15} strokeWidth={1.5} style={{ flexShrink: 0 }} />
          <span>Settings</span>
        </Link>
        <button
          type="button"
          onClick={signOut}
          className="nav-item"
          style={{ cursor: "pointer", width: "100%", background: "none", border: "none", textAlign: "left", font: "inherit", color: "inherit" }}
        >
          <LogOut size={15} strokeWidth={1.5} style={{ flexShrink: 0 }} />
          <span>Sign out</span>
        </button>

        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 12px",
          marginTop: 6,
          borderTop: "1px solid var(--border)",
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: "var(--primary)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, color: "white", flexShrink: 0,
          }}>R</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", lineHeight: 1.1 }}>Rehan</div>
            <div style={{ fontSize: 10, color: "var(--dim)" }}>Administrator</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
