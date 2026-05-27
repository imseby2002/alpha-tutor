import { redirect } from "next/navigation";
import ParentPortalClient from "./ParentPortalClient";
import { ROLE_HOME } from "@/lib/auth";
import { fetchParentChildren } from "@/lib/parent-children";
import { getCurrentProfile } from "@/lib/supabase/profile";

export default async function ParentPortalPage() {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/login");
  }
  if (profile.role !== "parent" && profile.role !== "admin") {
    redirect(ROLE_HOME[profile.role]);
  }

  const children =
    profile.role === "parent" ? await fetchParentChildren(profile.id) : [];

  return <ParentPortalClient initialChildren={children} />;
}
