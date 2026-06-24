import { getDashboardSummary } from "@/lib/dashboard";
import DashboardView from "./DashboardView";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const s = await getDashboardSummary();
  return <DashboardView s={s} />;
}
