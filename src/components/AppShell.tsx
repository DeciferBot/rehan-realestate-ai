"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMarketing = pathname.startsWith("/landing");

  if (isMarketing) {
    return <>{children}</>;
  }

  return (
    <>
      <Sidebar />
      <main style={{ marginLeft: "var(--sidebar-w)", minHeight: "100dvh" }}>
        {children}
      </main>
    </>
  );
}
