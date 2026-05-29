"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "invalid_link") {
      setError("重設連結無效或已過期，請重新申請重設密碼。");
      setValidating(false);
      return;
    }

    const parseHash = (hash: string) => {
      if (!hash) return {} as Record<string, string>;
      return hash
        .replace(/^#/, "")
        .split("&")
        .map((pair) => pair.split("="))
        .reduce((acc, [k, v]) => {
          acc[decodeURIComponent(k)] = decodeURIComponent(v || "");
          return acc;
        }, {} as Record<string, string>);
    };

    const parseSearch = (search: string) => {
      if (!search) return {} as Record<string, string>;
      return search
        .replace(/^\?/, "")
        .split("&")
        .map((pair) => pair.split("="))
        .reduce((acc, [k, v]) => {
          acc[decodeURIComponent(k)] = decodeURIComponent(v || "");
          return acc;
        }, {} as Record<string, string>);
    };

    const validateSession = async () => {
      const supabase = createClient();

      const hash = typeof window !== "undefined" ? window.location.hash : "";
      const search = typeof window !== "undefined" ? window.location.search : "";
      const params = {
        ...parseSearch(search),
        ...parseHash(hash),
      };

      if (params.access_token) {
        const { error: setErr } = await supabase.auth.setSession({
          access_token: params.access_token,
          refresh_token: params.refresh_token,
        } as any);

        if (setErr) {
          setError("無法建立會話，請重新申請重設密碼。");
          setValidating(false);
          return;
        }
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("無效的重設連結或連結已過期，請重新申請重設密碼。");
      }
      setValidating(false);
    };

    validateSession();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError("密碼不相符，請重新檢查。");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("密碼至少需 8 個字元。");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    try {
      const { error: respErr } = await supabase.auth.updateUser({
        password: password,
      });

      if (respErr) {
        setError(respErr.message || "密碼重設失敗，請稍後再試。");
      } else {
        setMessage("密碼已成功重設，請重新登入。");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (e: any) {
      setError(e?.message ?? "密碼重設失敗，請稍後再試。");
    }
    setLoading(false);
  };

  if (validating) {
    return (
      <div style={{ padding: "2rem", maxWidth: "480px", margin: "3rem auto" }}>
        <div className="glass-panel" style={{ padding: "2rem", textAlign: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.7)" }}>驗證連結中…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "480px", margin: "3rem auto" }}>
      <div className="glass-panel" style={{ padding: "2rem" }}>
        <h1 className="text-gradient" style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
          設定新密碼
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "1rem" }}>
          請輸入新密碼以重設你的帳戶。
        </p>

        {error && (
          <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid var(--danger)", padding: "0.75rem", borderRadius: "0.5rem", color: "var(--danger)", marginBottom: "1rem", fontSize: "0.9rem" }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid var(--accent)", padding: "0.75rem", borderRadius: "0.5rem", color: "var(--accent)", marginBottom: "1rem", fontSize: "0.9rem" }}>
            {message}
          </div>
        )}

        {!error ? (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)" }}>新密碼</span>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="至少 8 個字元"
                style={{ padding: "0.75rem 1rem", borderRadius: "0.5rem", border: "1px solid var(--glass-border)", background: "var(--surface)", color: "white" }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)" }}>確認密碼</span>
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="再次輸入密碼"
                style={{ padding: "0.75rem 1rem", borderRadius: "0.5rem", border: "1px solid var(--glass-border)", background: "var(--surface)", color: "white" }}
              />
            </label>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "重設中…" : "重設密碼"}
            </button>
          </form>
        ) : null}

        <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "rgba(255,255,255,0.6)" }}>
          <Link href="/login" style={{ color: "var(--primary)" }}>
            返回登入
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: "2rem", maxWidth: "480px", margin: "3rem auto" }}>
          <div className="glass-panel" style={{ padding: "2rem", textAlign: "center" }}>
            <p style={{ color: "rgba(255,255,255,0.7)" }}>載入中…</p>
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
