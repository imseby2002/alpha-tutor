"use client";

import { useEffect, useState } from "react";

export function StudentLinkCode() {
  const [linkCode, setLinkCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.profile?.link_code) {
          setLinkCode(data.profile.link_code);
        }
      })
      .catch(() => {});
  }, []);

  if (!linkCode) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(linkCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="glass-panel"
      style={{
        padding: "0.5rem 1rem",
        borderRadius: "999px",
        display: "flex",
        gap: "0.75rem",
        alignItems: "center",
        fontSize: "0.85rem",
      }}
    >
      <span style={{ color: "rgba(255,255,255,0.7)" }}>我的綁定碼</span>
      <code style={{ fontWeight: 700, letterSpacing: "0.1em" }}>{linkCode}</code>
      <button
        type="button"
        className="btn-secondary"
        style={{ padding: "0.2rem 0.6rem", fontSize: "0.75rem" }}
        onClick={handleCopy}
      >
        {copied ? "已複製" : "複製"}
      </button>
    </div>
  );
}
