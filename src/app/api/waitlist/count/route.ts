import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export const revalidate = 60; // cache for 60s

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { count } = await supabase
      .from("waitlist")
      .select("*", { count: "exact", head: true });
    return NextResponse.json({ count: count ?? 0 });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
