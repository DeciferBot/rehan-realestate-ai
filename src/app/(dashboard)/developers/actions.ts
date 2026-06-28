"use server";

import { revalidatePath } from "next/cache";
import {
  listDeveloperDocuments,
  uploadDeveloperDocument,
} from "@/lib/documents";
import type { DocItem } from "@/lib/documents-shared";

export async function listDocsAction(developer: string, kind: string): Promise<DocItem[]> {
  return listDeveloperDocuments(developer, kind);
}

export async function uploadDocAction(
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  const developer = String(formData.get("developer") ?? "");
  const kind = String(formData.get("kind") ?? "");
  const file = formData.get("file");

  if (!developer || !kind) return { ok: false, error: "Missing developer or category" };
  if (!(file instanceof File)) return { ok: false, error: "No file provided" };

  const result = await uploadDeveloperDocument({ developer, kind, file });
  if (result.ok) revalidatePath("/developers");
  return result;
}
