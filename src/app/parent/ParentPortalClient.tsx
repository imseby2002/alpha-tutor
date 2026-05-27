"use client";

import { useCallback, useState } from "react";

export type ChildProfile = {
  id: string;
  display_name: string | null;
  level: number;
  xp: number;
  link_code: string;
};

type Props = {
  initialChildren: ChildProfile[];
};

export default function ParentPortalClient({ initialChildren }: Props) {
  const [children, setChildren] = useState(initialChildren);
  const [linkCode, setLinkCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialChildren[0]?.id ?? null
  );

  const loadChildren = useCallback(async () => {
    const res = await fetch("/api/parent/children");
    const data = await res.json();
    if (res.ok) {
      const list = (data.children ?? []) as ChildProfile[];
      setChildren(list);
      setSelectedId((prev) => {
        if (prev && list.some((c) => c.id === prev)) return prev;
        return list[0]?.id ?? null;
      });
    }
  }, []);

  const handleLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    const res = await fetch("/api/parent/link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ linkCode }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "綁定失敗");
      return;
    }
    setMessage(`已連結孩子：${data.student?.display_name ?? "學生"}`);
    setLinkCode("");
    await loadChildren();
  };

  const selected = children.find((c) => c.id === selectedId) ?? children[0];

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <header style={{ marginBottom: "2rem" }}>
        <h1 className="text-gradient" style={{ fontSize: "2rem" }}>
          家長專區
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)", marginTop: "0.5rem" }}>
          綁定多位孩子的學習帳號，查看學習摘要（一個家長帳號可連結多位小孩）
        </p>
      </header>

      <div className="glass-panel" style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>連結孩子帳號</h2>
        <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.6)", marginBottom: "1rem" }}>
          請向孩子索取「綁定碼」（學生登入後可在學習頁右上角複製），輸入後即可連結。
        </p>
        <form onSubmit={handleLink} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <input
            value={linkCode}
            onChange={(e) => setLinkCode(e.target.value.toUpperCase())}
            placeholder="輸入 8 碼綁定碼"
            maxLength={8}
            style={{
              flex: 1,
              minWidth: "200px",
              padding: "0.75rem 1rem",
              borderRadius: "0.5rem",
              border: "1px solid var(--glass-border)",
              background: "var(--surface)",
              color: "white",
            }}
          />
          <button type="submit" className="btn-primary">
            綁定孩子
          </button>
        </form>
        {message && <p style={{ color: "var(--accent)", marginTop: "0.75rem" }}>{message}</p>}
        {error && <p style={{ color: "var(--danger)", marginTop: "0.75rem" }}>{error}</p>}
      </div>

      {children.length > 0 ? (
        <>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            {children.map((child) => (
              <button
                key={child.id}
                type="button"
                className={selected?.id === child.id ? "btn-primary" : "btn-secondary"}
                style={{ padding: "0.4rem 0.9rem", fontSize: "0.9rem" }}
                onClick={() => setSelectedId(child.id)}
              >
                {child.display_name ?? "學生"}（Lv.{child.level}）
              </button>
            ))}
          </div>

          <div
            className="glass-panel hover-scale"
            style={{
              marginBottom: "2rem",
              background: "rgba(139, 92, 246, 0.1)",
              border: "1px solid var(--primary)",
            }}
          >
            <h2
              style={{
                color: "var(--primary)",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span>✨</span> {selected?.display_name ?? "孩子"}的 AI 每日報告
            </h2>
            <p style={{ lineHeight: "1.8", color: "rgba(255,255,255,0.9)" }}>
              {selected?.display_name ?? "孩子"}目前等級 <strong>{selected?.level}</strong>，累積{" "}
              <strong>{selected?.xp} XP</strong>。
              <br />
              <br />
              <strong>AI 建議：</strong> 持續完成每日診斷與自適應練習，系統會依年級與科目自動調整難度。
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            <div className="glass-panel">
              <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", color: "rgba(255,255,255,0.7)" }}>
                精通等級
              </h3>
              <p style={{ fontSize: "2rem", fontWeight: 700 }}>等級 {selected?.level}</p>
              <p style={{ fontSize: "0.85rem", marginTop: "0.5rem", color: "rgba(255,255,255,0.5)" }}>
                XP：{selected?.xp}
              </p>
            </div>
            <div className="glass-panel">
              <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", color: "rgba(255,255,255,0.7)" }}>
                已綁定孩子
              </h3>
              <p style={{ fontSize: "2rem", fontWeight: 700 }}>{children.length}</p>
            </div>
          </div>
        </>
      ) : (
        <div className="glass-panel" style={{ marginBottom: "2rem", textAlign: "center", padding: "2rem" }}>
          <p style={{ color: "rgba(255,255,255,0.7)" }}>尚未綁定任何孩子，請先輸入綁定碼。</p>
        </div>
      )}
    </div>
  );
}
