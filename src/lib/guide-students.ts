import { createClient } from "@/lib/supabase/server";

export type LinkedStudent = {
  id: string;
  display_name: string | null;
  level: number;
  xp: number;
  link_code: string;
  class_name?: string;
};

export async function fetchGuideStudents(guideId: string): Promise<LinkedStudent[]> {
  const supabase = await createClient();
  const { data: classes } = await supabase
    .from("classes")
    .select("id, name")
    .eq("guide_id", guideId);

  const classIds = (classes ?? []).map((c) => c.id);
  if (classIds.length === 0) return [];

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("class_id, student_id")
    .in("class_id", classIds);

  const studentIds = [...new Set((enrollments ?? []).map((e) => e.student_id))];
  if (studentIds.length === 0) return [];

  const { data: students } = await supabase
    .from("profiles")
    .select("id, display_name, level, xp, link_code")
    .in("id", studentIds);

  const classNameById = new Map((classes ?? []).map((c) => [c.id, c.name]));
  const classByStudent = new Map<string, string>();
  for (const e of enrollments ?? []) {
    classByStudent.set(e.student_id, classNameById.get(e.class_id) ?? "班級");
  }

  return (students ?? []).map((s) => ({
    ...s,
    class_name: classByStudent.get(s.id) ?? "班級",
  })) as LinkedStudent[];
}
