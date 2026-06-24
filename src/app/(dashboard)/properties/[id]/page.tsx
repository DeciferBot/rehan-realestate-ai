import { notFound } from "next/navigation";
import { getPropertyById } from "@/lib/data";
import PropertyDetailClient from "./PropertyDetailClient";

export const dynamic = "force-dynamic";

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await getPropertyById(id);
  if (!property) notFound();
  return <PropertyDetailClient property={property} />;
}
