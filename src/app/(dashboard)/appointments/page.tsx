import { getAppointments } from "@/lib/data";
import AppointmentsClient from "./AppointmentsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Appointments",
  description: "Viewings and calls booked by your AI agents, ready for your closers.",
};

export default async function AppointmentsPage() {
  const appointments = await getAppointments();
  return <AppointmentsClient appointments={appointments} />;
}
