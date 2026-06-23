import { getAppointments } from "@/lib/data";
import AppointmentsClient from "./AppointmentsClient";

export const dynamic = "force-dynamic";

export default async function AppointmentsPage() {
  const appointments = await getAppointments();
  return <AppointmentsClient appointments={appointments} />;
}
