import { getProperties } from "@/lib/data";
import PropertiesClient from "./PropertiesClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Properties",
  description: "Your live inventory — the grounding source for every AI conversation.",
};

export default async function PropertiesPage() {
  const properties = await getProperties();
  return <PropertiesClient properties={properties} />;
}
