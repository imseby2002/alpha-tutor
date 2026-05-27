import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { NextResponse } from "next/server";

export async function GET() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "guide") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const supabase = await createClient();
  const { data: classes, error: classError } = await supabase
    .from("classes")
    .select("id, name")
    .eq("guide_id", profile.id);

  if (classError) {
    return NextResponse.json({ error: classError.message }, { status: 500 });
  }

  const classIds = (classes ?? []).map((c) => c.id);
  if (classIds.length === 0) {
    return NextResponse.json({ students: [], classes: [] });
  }

  const { data: enrollments, error: enrollError } = await supabase
    .from("enrollments")
    .select("class_id, student_id")
    .in("class_id", classIds);

  if (enrollError) {
    return NextResponse.json({ error: enrollError.message }, { status: 500 });
  }

  const studentIds = [...new Set((enrollments ?? []).map((e) => e.student_id))];
  if (studentIds.length === 0) {
    return NextResponse.json({ students: [], classes: classes ?? [] });
  }

  const { data: students, error } = await supabase
    .from("profiles")
    .select("id, display_name, level, xp, link_code")
    .in("id", studentIds);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const classNameById = new Map((classes ?? []).map((c) => [c.id, c.name]));
  const classByStudent = new Map<string, string>();
  for (const e of enrollments ?? []) {
    classByStudent.set(e.student_id, classNameById.get(e.class_id) ?? "班級");
  }

  const result = (students ?? []).map((s) => ({
    ...s,
    class_name: classByStudent.get(s.id) ?? "班級",
  }));

  return NextResponse.json({ students: result, classes: classes ?? [] });
}
