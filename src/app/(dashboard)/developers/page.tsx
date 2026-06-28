import { getDevelopers, getProperties } from "@/lib/data";
import { getDocCountsByDeveloper } from "@/lib/documents";
import DevelopersClient from "./DevelopersClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Developers",
  description: "Manage the developers and projects behind your inventory.",
};

export default async function DevelopersPage() {
  const [developers, properties, docCounts] = await Promise.all([
    getDevelopers(),
    getProperties(),
    getDocCountsByDeveloper(),
  ]);
  return (
    <DevelopersClient developers={developers} properties={properties} docCounts={docCounts} />
  );
}
