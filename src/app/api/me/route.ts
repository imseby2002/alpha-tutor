import { getCurrentProfile } from "@/lib/supabase/profile";
import { NextResponse } from "next/server";

export async function GET() {
  const profile = await getCurrentProfile();
  if (!profile) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ profile });
}
