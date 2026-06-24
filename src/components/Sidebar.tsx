"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase/browser";
import { useSidebar } from "@/components/sidebar-context";
import { Row, Stack, Text, StatusDot } from "@/ui";
import {
  LayoutDashboard, Users, Building2, Calendar,
  FolderOpen, Settings, LogOut, Inbox, Bot, Layers, Plug, ShieldCheck,
} from "lucide-react";

const navItems = [
  { href: "/console",       label: "Dashboard",     icon: LayoutDashboard },
  { href: "/inbox",         label: "Conversations", icon: Inbox },
  { href: "/leads",         label: "Leads",         icon: Users },
  { href: "/properties",    label: "Properties",    icon: Building2 },
  { href: "/appointments",  label: "Appointments",  icon: Calendar },
  { href: "/developers",    label: "Developers",    icon: FolderOpen },
  { href: "/settings/inventory", label: "Inventory", icon: Layers },
  { href: "/settings/agent", label: "Agent Setup",  icon: Bot },
  { href: "/settings/integrations", label: "Integrations", icon: Plug },
  { href: "/audit",         label: "Audit log",     icon: ShieldCheck },
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
    <aside className={`app-sidebar${open ? " open" : ""}`}>
      {/* App mark */}
      <div className="sidebar-head">
        <Row gap={4} style={{ marginBottom: "var(--space-6)" }}>
          <div className="topbar-avatar">A</div>
          <Stack gap={1}>
            <Text as="div" size="md" weight="semibold" style={{ lineHeight: 1.1, letterSpacing: "-0.01em" }}>Acre</Text>
            <Text as="div" size="2xs" tone="dim" style={{ letterSpacing: "0.06em" }}>Simmer Properties</Text>
          </Stack>
        </Row>
        <Row gap={3} className="sidebar-status">
          <StatusDot state="online" />
          <Text size="sm" weight="medium" tone="success">Acre · online</Text>
        </Row>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="section-label" style={{ padding: "0 var(--space-5)", marginBottom: "var(--space-3)" }}>
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
      <div className="sidebar-foot">
        <Link href="/settings/agent" className="nav-item">
          <Settings size={15} strokeWidth={1.5} style={{ flexShrink: 0 }} />
          <span>Settings</span>
        </Link>
        <button
          type="button"
          onClick={signOut}
          className="nav-item"
          style={{ width: "100%", background: "none", border: "none", textAlign: "left", font: "inherit", color: "inherit", cursor: "pointer" }}
        >
          <LogOut size={15} strokeWidth={1.5} style={{ flexShrink: 0 }} />
          <span>Sign out</span>
        </button>

        <Row gap={4} className="sidebar-user">
          <div className="topbar-avatar">R</div>
          <Stack gap={1}>
            <Text as="div" size="base" weight="medium" style={{ lineHeight: 1.1 }}>Simmer Properties</Text>
            <Text as="div" size="2xs" tone="dim">Administrator</Text>
          </Stack>
        </Row>
      </div>
    </aside>
  );
}
