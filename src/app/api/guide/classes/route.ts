import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { NextResponse } from "next/server";

export async function GET() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "guide") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("classes")
    .select("id, name, created_at")
    .eq("guide_id", profile.id)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ classes: data ?? [] });
}
