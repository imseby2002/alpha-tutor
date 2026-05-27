import { createClient } from "@/lib/supabase/server";
import type { UserProfile, UserRole } from "@/lib/auth";

export async function getCurrentProfile(): Promise<UserProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, role, level, xp, link_code")
    .eq("id", user.id)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    display_name: data.display_name,
    role: data.role as UserRole,
    level: data.level,
    xp: data.xp,
    link_code: data.link_code,
  };
}
