"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ROLE_HOME, ROLE_LABEL, type UserRole } from "@/lib/auth";

const SIGNUP_ROLES: UserRole[] = ["student", "guide", "parent"];

export default function SignupPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          role,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.session && data.user) {
      router.replace(ROLE_HOME[role]);
      router.refresh();
      return;
    }

    setMessage("註冊成功！若已啟用 Email 驗證，請到信箱點擊連結後再登入。");
    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "480px", margin: "3rem auto" }}>
      <div className="glass-panel" style={{ padding: "2rem" }}>
        <h1 className="text-gradient" style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
          註冊帳號
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "1.5rem" }}>
          選擇你的身份：學生、導師或家長（註冊後會進入對應頁面）
        </p>

        <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)" }}>顯示名稱</span>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              style={inputStyle}
              placeholder="例如：陳小愛"
            />
          </label>

          <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
            <legend style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", marginBottom: "0.5rem" }}>
              身份
            </legend>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {SIGNUP_ROLES.map((r) => (
                <label
                  key={r}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.6rem 0.75rem",
                    borderRadius: "0.5rem",
                    border: `1px solid ${role === r ? "var(--primary)" : "var(--glass-border)"}`,
                    background: role === r ? "rgba(139, 92, 246, 0.15)" : "transparent",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r}
                    checked={role === r}
                    onChange={() => setRole(r)}
                  />
                  {ROLE_LABEL[r]}
                </label>
              ))}
            </div>
          </fieldset>

          <label style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)" }}>Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)" }}>密碼（至少 6 碼）</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </label>

          {role === "parent" && (
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", margin: 0 }}>
              家長註冊後，可用孩子的「綁定碼」連結多位小孩。
            </p>
          )}
          {role === "guide" && (
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", margin: 0 }}>
              導師註冊後會自動建立預設班級，可用學生綁定碼收學生。
            </p>
          )}
          {role === "student" && (
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", margin: 0 }}>
              學生註冊後會獲得專屬綁定碼，提供給家長或導師連結。
            </p>
          )}

          {error && <p style={{ color: "var(--danger)", fontSize: "0.9rem", margin: 0 }}>{error}</p>}
          {message && <p style={{ color: "var(--accent)", fontSize: "0.9rem", margin: 0 }}>{message}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "註冊中…" : "建立帳號"}
          </button>
        </form>

        <p style={{ marginTop: "1.5rem", fontSize: "0.9rem", color: "rgba(255,255,255,0.6)" }}>
          已有帳號？{" "}
          <Link href="/login" style={{ color: "var(--primary)" }}>
            登入
          </Link>
        </p>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "0.75rem 1rem",
  borderRadius: "0.5rem",
  border: "1px solid var(--glass-border)",
  background: "var(--surface)",
  color: "white",
  fontSize: "1rem",
};
