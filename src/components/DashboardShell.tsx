"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { SidebarContext } from "@/components/sidebar-context";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      <Sidebar />
      {open && <div className="app-overlay" onClick={() => setOpen(false)} aria-hidden />}
      <main className="app-main">{children}</main>
    </SidebarContext.Provider>
  );
}
