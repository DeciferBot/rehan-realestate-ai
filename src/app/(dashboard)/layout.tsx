import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <main style={{ marginLeft: "var(--sidebar-w)", minHeight: "100dvh" }}>
        {children}
      </main>
    </>
  );
}
