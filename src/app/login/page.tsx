"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ROLE_HOME, type UserRole } from "@/lib/auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("登入失敗，請確認 Email 與密碼。");
      setLoading(false);
      return;
    }

    if (data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      const role = (profile?.role ?? "student") as UserRole;
      router.replace(next === "/" ? ROLE_HOME[role] : next);
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "420px", margin: "4rem auto" }}>
      <div className="glass-panel" style={{ padding: "2rem" }}>
        <h1 className="text-gradient" style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
          登入 Alpha Tutor
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "1.5rem" }}>
          使用你的帳號進入對應的學習／導師／家長頁面
        </p>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)" }}>Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              placeholder="you@example.com"
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)" }}>密碼</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              placeholder="••••••••"
            />
          </label>

          {error && (
            <p style={{ color: "var(--danger)", fontSize: "0.9rem", margin: 0 }}>{error}</p>
          )}

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: "0.5rem" }}>
            {loading ? "登入中…" : "登入"}
          </button>
        </form>

        <p style={{ marginTop: "1.5rem", fontSize: "0.9rem", color: "rgba(255,255,255,0.6)" }}>
          還沒有帳號？{" "}
          <Link href="/signup" style={{ color: "var(--primary)" }}>
            註冊新帳號
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ padding: "4rem", textAlign: "center" }}>載入中…</div>}>
      <LoginForm />
    </Suspense>
  );
}
