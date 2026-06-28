import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { getActiveTenantId } from "@/lib/spine";

const VALID_STATUSES = ["new", "engaging", "qualified", "appointed", "closed", "lost"];

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let body: { status?: string; notes?: string; assigned_member_id?: string | null; assigned_label?: string | null };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const sb = getSupabaseAdmin();
  const tenantId = await getActiveTenantId();
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.status !== undefined) {
    if (!VALID_STATUSES.includes(body.status))
      return NextResponse.json({ ok: false, error: "invalid_status" }, { status: 400 });
    update.status = body.status;
  }
  if (body.notes !== undefined) update.notes = body.notes;
  if (body.assigned_member_id !== undefined) update.assigned_member_id = body.assigned_member_id;
  if (body.assigned_label !== undefined) update.assigned_label = body.assigned_label;

  const { error } = await sb
    .from("contacts")
    .update(update)
    .eq("tenant_id", tenantId)
    .eq("id", id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
