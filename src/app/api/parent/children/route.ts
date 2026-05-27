import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { NextResponse } from "next/server";

export async function GET() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "parent") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const supabase = await createClient();
  const { data: links, error: linkError } = await supabase
    .from("parent_student_links")
    .select("student_id")
    .eq("parent_id", profile.id);

  if (linkError) {
    return NextResponse.json({ error: linkError.message }, { status: 500 });
  }

  const studentIds = (links ?? []).map((l) => l.student_id);
  if (studentIds.length === 0) {
    return NextResponse.json({ children: [] });
  }

  const { data: children, error } = await supabase
    .from("profiles")
    .select("id, display_name, level, xp, link_code")
    .in("id", studentIds);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ children: children ?? [] });
}
