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
  const [linkHint, setLinkHint] = useState<string | null>(null);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [pastedLink, setPastedLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);

  const parsePairString = (input: string, separator: string) => {
    if (!input) return {} as Record<string, string>;
    return input
      .replace(new RegExp(`^[${separator}]`), "")
      .split("&")
      .map((pair) => {
        const [key, ...rest] = pair.split("=");
        return [key, rest.join("=")];
      })
      .reduce((acc, [k, v]) => {
        acc[decodeURIComponent(k)] = decodeURIComponent(v || "");
        return acc;
      }, {} as Record<string, string>);
  };

  const parseLinkInput = (value: string) => {
    if (!value) return {} as Record<string, string>;

    try {
      const url = new URL(value);
      return {
        ...parsePairString(url.search, "?"),
        ...parsePairString(url.hash, "#"),
      };
    } catch {
      // If the user pasted only a fragment or query string
      return {
        ...parsePairString(value, "?"),
        ...parsePairString(value, "#"),
      };
    }
  };

  const exchangeRecoveryParams = async (supabase: ReturnType<typeof createClient>, params: Record<string, string>) => {
    if (params.access_token && params.refresh_token) {
      return supabase.auth.setSession({
        access_token: params.access_token,
        refresh_token: params.refresh_token,
      } as any);
    }

    if (params.code && params.type === "recovery") {
      // Use server-side API to exchange recovery code
      try {
        const response = await fetch("/api/auth/exchange-recovery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: params.code }),
        });
        const data = await response.json();
        if (data.error) {
          return { error: data.error };
        }
        // Set the session from the returned tokens
        if (data.session) {
          return supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          } as any);
        }
        return { error: "No session in response" };
      } catch (err: any) {
        return { error: err.message };
      }
    }

    return { error: null } as { error: any };
  };

  const handlePasteLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLinkError(null);
    setError(null);
    setLinkHint(null);

    const params = parseLinkInput(pastedLink);
    if (!params.access_token || !params.refresh_token) {
      if (!(params.code && params.type === "recovery")) {
        setLinkError("請貼上包含 access_token 與 refresh_token，或 recovery code 的完整重設連結。");
        return;
      }
    }

    const supabase = createClient();
    const { error: setErr } = await exchangeRecoveryParams(supabase, params);

    if (setErr) {
      setLinkError("無法從貼上的連結建立會話，請重新申請重設密碼。");
      return;
    }

    setLinkHint("已成功解析貼上連結，請繼續輸入新密碼。");
  };

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "invalid_link") {
      setError("重設連結無效或已過期，請重新申請重設密碼。");
      setLinkHint("請確認你是從電子郵件中的重設連結開啟，或直接貼上完整重設連結。");
      setValidating(false);
      return;
    }

    const validateSession = async () => {
      const supabase = createClient();
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      const search = typeof window !== "undefined" ? window.location.search : "";
      const params = {
        ...parsePairString(search, "?"),
        ...parsePairString(hash, "#"),
      };

      console.log("[ResetPassword] URL State:", { hash: hash.substring(0, 50), search: search.substring(0, 50) });
      console.log("[ResetPassword] Parsed tokens:", { hasAccessToken: !!params.access_token, hasCode: !!params.code, type: params.type });

      const hasAccessToken = !!params.access_token;
      const hasRecoveryCode = !!(params.code && params.type === "recovery");

      if (hasAccessToken || hasRecoveryCode) {
        const { error: setErr } = await exchangeRecoveryParams(supabase, params);
        if (setErr) {
          console.error("[ResetPassword] Exchange error:", setErr);
          setError("無法建立會話，請重新申請重設密碼。");
          setValidating(false);
          return;
        }
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.warn("[ResetPassword] No user after validation. Has token:", hasAccessToken || hasRecoveryCode);
        setError("未偵測到重設密碼連結內容，請確認你是從電子郵件連結開啟，或直接貼上完整重設連結。");
        setLinkHint("若你貼上連結，請確保它包含 access_token 與 refresh_token。");
      } else {
        setLinkHint("連結已成功解析，請輸入新密碼。");
      }
      setValidating(false);
    };

    validateSession();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setLinkError(null);
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

        {linkError && (
          <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid var(--danger)", padding: "0.75rem", borderRadius: "0.5rem", color: "var(--danger)", marginBottom: "1rem", fontSize: "0.9rem" }}>
            {linkError}
          </div>
        )}

        {linkHint && (
          <div style={{ background: "rgba(56, 189, 248, 0.08)", border: "1px solid rgba(56, 189, 248, 0.4)", padding: "0.75rem", borderRadius: "0.5rem", color: "#a5f3fc", marginBottom: "1rem", fontSize: "0.9rem" }}>
            {linkHint}
          </div>
        )}

        <form onSubmit={handlePasteLink} style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)" }}>若重設連結未自動生效，請貼上完整連結</span>
            <input
              type="text"
              value={pastedLink}
              onChange={(e) => setPastedLink(e.target.value)}
              placeholder="https://...#access_token=...&refresh_token=..."
              style={{ padding: "0.75rem 1rem", borderRadius: "0.5rem", border: "1px solid var(--glass-border)", background: "var(--surface)", color: "white" }}
            />
          </label>
          <button type="submit" className="btn-secondary">
            解析重設連結
          </button>
        </form>

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
