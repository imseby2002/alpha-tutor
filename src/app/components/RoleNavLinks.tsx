import Link from "next/link";
import { getCurrentProfile } from "@/lib/supabase/profile";

const linkStyle = {
  color: "var(--foreground)",
  textDecoration: "none",
  fontWeight: 500,
} as const;

export async function RoleNavLinks() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return null;
  }

  return (
    <>
      {(profile.role === "student" || profile.role === "admin") && (
        <>
          <Link href="/" style={linkStyle} className="hover-scale">
            學生學習
          </Link>
          <Link href="/curriculum" style={linkStyle} className="hover-scale">
            課程內容
          </Link>
        </>
      )}
      {(profile.role === "guide" || profile.role === "admin") && (
        <Link href="/guide" style={linkStyle} className="hover-scale">
          導師儀表板
        </Link>
      )}
      {(profile.role === "parent" || profile.role === "admin") && (
        <Link href="/parent" style={linkStyle} className="hover-scale">
          家長報告
        </Link>
      )}
      {profile.role === "admin" && (
        <Link href="/admin" style={{ ...linkStyle, color: "var(--warning)" }} className="hover-scale">
          平台管理
        </Link>
      )}
    </>
  );
}
