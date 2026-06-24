import { getDashboardSummary } from "@/lib/dashboard";
import DashboardView from "./DashboardView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Console",
  description: "Your real-time sales command center — leads, conversations, and appointments at a glance.",
};

export default async function Dashboard() {
  const s = await getDashboardSummary();
  return <DashboardView s={s} />;
}
