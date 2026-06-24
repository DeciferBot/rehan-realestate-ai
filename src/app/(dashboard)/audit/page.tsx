import { getAuditEvents } from "@/lib/audit";
import AuditClient from "./AuditClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Audit log",
  description: "Every AI and operator action, logged and explainable — isolated per tenant.",
};

export default async function AuditPage() {
  const events = await getAuditEvents();
  return <AuditClient events={events} />;
}
