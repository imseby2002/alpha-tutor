import { redirect } from "next/navigation";
import GuidePortalClient from "./GuidePortalClient";
import { ROLE_HOME } from "@/lib/auth";
import { fetchGuideStudents } from "@/lib/guide-students";
import { getCurrentProfile } from "@/lib/supabase/profile";

export default async function GuidePortalPage() {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/login");
  }
  if (profile.role !== "guide" && profile.role !== "admin") {
    redirect(ROLE_HOME[profile.role]);
  }

  const linkedStudents =
    profile.role === "guide" ? await fetchGuideStudents(profile.id) : [];

  return <GuidePortalClient initialLinkedStudents={linkedStudents} />;
}
