import { createClient } from "@/lib/supabase/server";
import type { ChildProfile } from "@/app/parent/ParentPortalClient";

export async function fetchParentChildren(parentId: string): Promise<ChildProfile[]> {
  const supabase = await createClient();
  const { data: links } = await supabase
    .from("parent_student_links")
    .select("student_id")
    .eq("parent_id", parentId);

  const studentIds = (links ?? []).map((l) => l.student_id);
  if (studentIds.length === 0) return [];

  const { data: children } = await supabase
    .from("profiles")
    .select("id, display_name, level, xp, link_code")
    .in("id", studentIds);

  return (children ?? []) as ChildProfile[];
}
