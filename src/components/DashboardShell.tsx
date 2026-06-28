"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { SidebarContext } from "@/components/sidebar-context";

export default function DashboardShell({
  children,
  tenantName,
  memberName,
  memberRole,
}: {
  children: React.ReactNode;
  tenantName: string;
  memberName: string | null;
  memberRole: string | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      <Sidebar tenantName={tenantName} memberName={memberName} memberRole={memberRole} />
      {open && <div className="app-overlay" onClick={() => setOpen(false)} aria-hidden />}
      <main className="app-main">{children}</main>
    </SidebarContext.Provider>
  );
}
