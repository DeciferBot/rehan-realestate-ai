import { getDevelopers, getProperties } from "@/lib/data";
import DevelopersClient from "./DevelopersClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Developers",
  description: "Manage the developers and projects behind your inventory.",
};

export default async function DevelopersPage() {
  const [developers, properties] = await Promise.all([getDevelopers(), getProperties()]);
  return <DevelopersClient developers={developers} properties={properties} />;
}
