import { getDevelopers, getProperties } from "@/lib/data";
import DevelopersClient from "./DevelopersClient";

export const dynamic = "force-dynamic";

export default async function DevelopersPage() {
  const [developers, properties] = await Promise.all([getDevelopers(), getProperties()]);
  return <DevelopersClient developers={developers} properties={properties} />;
}
