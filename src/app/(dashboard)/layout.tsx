import type { Metadata } from "next";
import DashboardShell from "@/components/DashboardShell";
import { resolveTenantContext } from "@/lib/spine";
import { Text, Stack } from "@/ui";

export const metadata: Metadata = {
  title: { default: "Console", template: "%s · Acre" },
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  let ctx: Awaited<ReturnType<typeof resolveTenantContext>>;
  try {
    ctx = await resolveTenantContext();
  } catch (e) {
    if ((e as { code?: string }).code === "no_tenant") {
      return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100dvh" }}>
          <Stack gap={4} style={{ textAlign: "center", maxWidth: 360, padding: 32 }}>
            <Text size="xl" weight="semibold">No workspace found</Text>
            <Text size="base" tone="dim">
              Your account isn&apos;t linked to any workspace yet. Contact your administrator to be added as a member.
            </Text>
          </Stack>
        </div>
      );
    }
    throw e;
  }

  return (
    <DashboardShell tenantName={ctx.tenantName} memberName={ctx.memberName} memberRole={ctx.memberRole}>
      {children}
    </DashboardShell>
  );
}
