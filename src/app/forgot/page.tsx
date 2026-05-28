"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function ForgotPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();
    try {
      const { data, error: respErr } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      });
      if (respErr) {
        setError(respErr.message || "寄送失敗，請稍後再試。");
      } else {
        setMessage("已寄出重設密碼信件，請到信箱點擊連結（若沒收到請檢查垃圾信件）。");
      }
    } catch (e: any) {
      setError(e?.message ?? "寄送失敗，請稍後再試。");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "480px", margin: "3rem auto" }}>
      <div className="glass-panel" style={{ padding: "2rem" }}>
        <h1 className="text-gradient" style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
          重設密碼
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "1rem" }}>
          輸入註冊用的 Email，我們會寄出重設密碼的連結給你。
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)" }}>Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: "0.75rem 1rem", borderRadius: "0.5rem", border: "1px solid var(--glass-border)", background: "var(--surface)", color: "white" }}
            />
          </label>

          {error && <p style={{ color: "var(--danger)", fontSize: "0.9rem", margin: 0 }}>{error}</p>}
          {message && <p style={{ color: "var(--accent)", fontSize: "0.9rem", margin: 0 }}>{message}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "寄送中…" : "寄送重設信"}
          </button>
        </form>

        <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "rgba(255,255,255,0.6)" }}>
          回到 {""}
          <Link href="/login" style={{ color: "var(--primary)" }}>
            登入
          </Link>
          或 {""}
          <Link href="/signup" style={{ color: "var(--primary)" }}>
            註冊
          </Link>
        </p>
      </div>
    </div>
  );
}
