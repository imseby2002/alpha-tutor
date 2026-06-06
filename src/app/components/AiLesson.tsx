"use client";

import { useEffect, useRef, useState } from "react";

type ChatTurn = { role: "user" | "assistant"; content: string };

type Props = {
  subjectLabel: string;
  topic: string;
  gradeLabel: string;
};

export default function AiLesson({ subjectLabel, topic, gradeLabel }: Props) {
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const callLesson = async (history: ChatTurn[]) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subjectLabel,
          topic,
          grade: gradeLabel,
          messages: history,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || "AI 上課服務發生錯誤");
      }
      setMessages((prev) => [...prev, { role: "assistant", content: payload.reply ?? "" }]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "無法連線到 AI 老師");
    } finally {
      setLoading(false);
    }
  };

  // 主題改變即開新課：清空對話並讓老師主動開講
  useEffect(() => {
    setMessages([]);
    setInput("");
    void callLesson([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectLabel, topic, gradeLabel]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: ChatTurn[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    void callLesson(next);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "0.5rem" }}>
        <h2 style={{ fontSize: "1.25rem", margin: 0, color: "var(--accent)" }}>
          🧑‍🏫 AI 家教上課中
        </h2>
        <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>
          {gradeLabel} • {subjectLabel}｜{topic}
        </span>
      </div>

      <div
        ref={scrollRef}
        style={{
          background: "var(--surface)",
          border: "1px solid var(--glass-border)",
          borderRadius: "0.75rem",
          padding: "1rem",
          height: "440px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "85%",
              background: m.role === "user" ? "var(--primary)" : "rgba(255,255,255,0.06)",
              border: m.role === "user" ? "none" : "1px solid var(--glass-border)",
              borderRadius: "0.9rem",
              padding: "0.7rem 0.95rem",
              color: "white",
              whiteSpace: "pre-wrap",
              lineHeight: 1.7,
              fontSize: "0.95rem",
            }}
          >
            {m.role === "assistant" && (
              <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)", marginBottom: "0.3rem" }}>
                老師
              </div>
            )}
            {m.content}
          </div>
        ))}

        {loading && (
          <div style={{ alignSelf: "flex-start", color: "rgba(255,255,255,0.6)", fontSize: "0.9rem" }}>
            老師正在思考…
          </div>
        )}

        {error && (
          <div style={{ alignSelf: "stretch", color: "var(--danger)", fontSize: "0.9rem" }}>
            {error}
            <button
              type="button"
              className="btn-secondary"
              style={{ marginLeft: "0.75rem", padding: "0.25rem 0.75rem", fontSize: "0.8rem" }}
              onClick={() => void callLesson(messages)}
            >
              重試
            </button>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {["我懂了，繼續", "可以再講一次嗎？", "舉個例子", "出一題讓我練習"].map((q) => (
          <button
            key={q}
            type="button"
            className="btn-secondary"
            style={{ padding: "0.4rem 0.85rem", fontSize: "0.82rem" }}
            disabled={loading}
            onClick={() => send(q)}
          >
            {q}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        style={{ display: "flex", gap: "0.5rem" }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="回答老師、或輸入你的問題…"
          disabled={loading}
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            borderRadius: "0.75rem",
            border: "1px solid var(--glass-border)",
            background: "var(--surface)",
            color: "white",
            fontSize: "0.95rem",
          }}
        />
        <button type="submit" className="btn-primary" disabled={loading || !input.trim()}>
          送出
        </button>
      </form>
    </div>
  );
}
