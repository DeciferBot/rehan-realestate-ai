import Header from "@/components/Header";
import { listForAdmin } from "@/lib/integrations";
import IntegrationsClient from "./IntegrationsClient";

export const dynamic = "force-dynamic";

export default async function IntegrationsPage() {
  const providers = await listForAdmin();
  const baseUrl = process.env.APP_URL || "https://simmerproperties.com";

  return (
    <div>
      <Header title="Integrations" subtitle="Connect channels and services — paste a key to switch each one on" />
      <div style={{ padding: "var(--space-9) var(--space-10)", maxWidth: 780 }}>
        <IntegrationsClient initial={providers} baseUrl={baseUrl} />
      </div>
    </div>
  );
}
