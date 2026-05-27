import Link from "next/link";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { ROLE_HOME, ROLE_LABEL } from "@/lib/auth";
import { SignOutButton } from "./SignOutButton";

export async function AuthNav() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return (
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Link href="/login" style={linkStyle}>
          登入
        </Link>
        <Link href="/signup" className="btn-primary" style={{ padding: "0.4rem 0.9rem", fontSize: "0.9rem" }}>
          註冊
        </Link>
      </div>
    );
  }

  const home = ROLE_HOME[profile.role];

  return (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
      <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.65)" }}>
        {profile.display_name ?? "使用者"}（{ROLE_LABEL[profile.role]}）
      </span>
      <Link href={home} style={linkStyle}>
        我的首頁
      </Link>
      <SignOutButton />
    </div>
  );
}

const linkStyle: React.CSSProperties = {
  color: "var(--foreground)",
  textDecoration: "none",
  fontWeight: 500,
  fontSize: "0.9rem",
};
