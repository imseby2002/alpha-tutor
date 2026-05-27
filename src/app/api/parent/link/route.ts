import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "parent") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as { linkCode?: string };
  const linkCode = body.linkCode?.trim();
  if (!linkCode) {
    return NextResponse.json({ error: "missing_code" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("link_child_by_code", {
    p_code: linkCode,
  });

  if (error) {
    const message =
      error.message.includes("invalid_code")
        ? "找不到此綁定碼，請確認學生提供的代碼。"
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
