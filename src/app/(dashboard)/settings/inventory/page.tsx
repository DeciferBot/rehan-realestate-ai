import Header from "@/components/Header";
import { getInventoryProjects } from "@/lib/admin";
import InventoryClient from "./InventoryClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Inventory Settings",
  description: "Connect and manage the live inventory that grounds your AI agents.",
};

export default async function InventoryPage() {
  const projects = await getInventoryProjects();
  return (
    <div>
      <Header title="Inventory" subtitle="Live developer inventory on the spine — drop availability PDFs to ingest" />
      <InventoryClient projects={projects} />
    </div>
  );
}
