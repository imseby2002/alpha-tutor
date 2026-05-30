import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { ROLE_HOME, type UserRole } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  try {
    console.log('[AuthCallback] GET invoked', { url: request.url });
    const entries: Record<string, string> = {};
    searchParams.forEach((v, k) => (entries[k] = v));
    console.log('[AuthCallback] searchParams:', entries);
  } catch (e) {
    console.warn('[AuthCallback] failed to log request info', e);
  }
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const type = searchParams.get("type");

  if (code) {
    // For recovery links, preserve the code so the client can exchange it and set session.
    if (type === "recovery") {
      return NextResponse.redirect(
        `${origin}/reset-password?code=${encodeURIComponent(code)}&type=recovery`
      );
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    // Handle password recovery flow
    if (type === "recovery") {
      if (error) {
        return NextResponse.redirect(`${origin}/reset-password?error=invalid_link`);
      }
      return NextResponse.redirect(`${origin}/reset-password`);
    }

    // Handle normal auth flow
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        const role = (profile?.role ?? "student") as UserRole;
        const home = ROLE_HOME[role];
        return NextResponse.redirect(`${origin}${next === "/" ? home : next}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
