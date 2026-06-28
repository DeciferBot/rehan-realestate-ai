import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { getActiveTenantId } from "@/lib/spine";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let body: { ai_paused?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const sb = getSupabaseAdmin();
  const tenantId = await getActiveTenantId();
  const update: Record<string, unknown> = {};
  if (typeof body.ai_paused === "boolean") update.ai_paused = body.ai_paused;
  if (!Object.keys(update).length)
    return NextResponse.json({ ok: false, error: "nothing_to_update" }, { status: 400 });

  const { error } = await sb
    .from("conversations")
    .update(update)
    .eq("tenant_id", tenantId)
    .eq("id", id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
