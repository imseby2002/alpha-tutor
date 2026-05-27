import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "guide") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as { classId?: string; linkCode?: string };
  const linkCode = body.linkCode?.trim();
  let classId = body.classId;

  const supabase = await createClient();

  if (!classId) {
    const { data: classes } = await supabase
      .from("classes")
      .select("id")
      .eq("guide_id", profile.id)
      .order("created_at", { ascending: true })
      .limit(1);
    classId = classes?.[0]?.id;
  }

  if (!classId || !linkCode) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const { data, error } = await supabase.rpc("enroll_student_by_code", {
    p_class_id: classId,
    p_code: linkCode,
  });

  if (error) {
    const message =
      error.message.includes("invalid_code")
        ? "找不到此綁定碼。"
        : error.message.includes("invalid_class")
          ? "班級不存在或無權限。"
          : error.message;
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const row = Array.isArray(data) ? data[0] : data;
  return NextResponse.json({
    student: {
      id: row?.student_id,
      display_name: row?.display_name,
    },
  });
}
