import { getProperties } from "@/lib/data";
import PropertiesClient from "./PropertiesClient";

export const dynamic = "force-dynamic";

export default async function PropertiesPage() {
  const properties = await getProperties();
  return <PropertiesClient properties={properties} />;
}
