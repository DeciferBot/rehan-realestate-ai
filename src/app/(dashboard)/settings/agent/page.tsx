import Header from "@/components/Header";
import { getAgentConfig, getTenantInfo } from "@/lib/admin";
import AgentConfigClient from "./AgentConfigClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Agent Settings",
  description: "Configure how your AI sales agents speak, qualify, and escalate.",
};

export default async function AgentSettingsPage() {
  const [config, tenant] = await Promise.all([getAgentConfig(), getTenantInfo()]);

  return (
    <div>
      <Header title="Agent Setup" subtitle={`Program ${tenant.name}'s AI agent — persona, languages, channels, rules`} />
      {config ? (
        <AgentConfigClient config={config} tenant={tenant} />
      ) : (
        <div style={{ padding: 28, color: "var(--dim)" }}>No agent configured for this tenant yet.</div>
      )}
    </div>
  );
}
