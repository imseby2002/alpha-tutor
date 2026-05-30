"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ALL_GRADES,
  ALL_SUBJECTS,
  GRADE_LABEL,
  SUBJECT_LABEL,
  type SchoolGrade,
  type Subject,
} from "@/lib/education";
import {
  type CurriculumResource,
  SUBJECT_LABEL as CURRICULUM_SUBJECT_LABEL,
} from "@/lib/curriculum";

const RESOURCE_TYPE_LABEL: Record<string, string> = {
  textbook: "教材",
  questionBank: "題庫",
  exam: "試題",
  lessonNotes: "講義／筆記",
};

const DEFAULT_COUNTRY = "TW";

function formatResourceType(type: string) {
  return RESOURCE_TYPE_LABEL[type] ?? type;
}

function getPreviewText(resource: CurriculumResource) {
  if (resource.description) return resource.description;
  if (resource.publisher) return `${resource.publisher}${resource.year ? ` • ${resource.year}` : ""}`;
  return "尚未提供說明。";
}

export default function CurriculumPage() {
  const [grade, setGrade] = useState<SchoolGrade>("G9");
  const [subject, setSubject] = useState<Subject>("math");
  const [resourceType, setResourceType] = useState<string>("");
  const [search, setSearch] = useState("");
  const [resources, setResources] = useState<CurriculumResource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryKey = useMemo(() => `${grade}-${subject}-${resourceType}-${search}`, [grade, subject, resourceType, search]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchResources = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.set("country", DEFAULT_COUNTRY);
        params.set("grade", grade);
        params.set("subject", subject);
        if (resourceType) params.set("type", resourceType);
        if (search) params.set("search", search);

        const response = await fetch(`/api/curriculum?${params.toString()}`, { signal: controller.signal });
        if (!response.ok) {
          const payload = await response.json();
          throw new Error(payload?.error || "取得課程資源失敗");
        }
        const payload = await response.json();
        setResources(payload.resources ?? []);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err?.message ?? "無法載入課程內容");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
    return () => controller.abort();
  }, [queryKey]);

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 className="text-gradient" style={{ marginBottom: "0.5rem" }}>
            課程內容
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", margin: 0 }}>
            瀏覽你目前年級與科目的教材、題庫、試題與講義。
          </p>
        </div>
        <Link href="/" className="btn-secondary" style={{ whiteSpace: "nowrap" }}>
          回到學生學習
        </Link>
      </div>

      <div className="glass-panel" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1rem" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)" }}>年級</span>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value as SchoolGrade)}
              style={{ padding: "0.75rem 1rem", borderRadius: "0.75rem", border: "1px solid var(--glass-border)", background: "var(--surface)", color: "white" }}
            >
              {ALL_GRADES.map((g) => (
                <option key={g} value={g}>
                  {GRADE_LABEL[g]}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)" }}>科目</span>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value as Subject)}
              style={{ padding: "0.75rem 1rem", borderRadius: "0.75rem", border: "1px solid var(--glass-border)", background: "var(--surface)", color: "white" }}
            >
              {ALL_SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {SUBJECT_LABEL[s]}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)" }}>資源類型</span>
            <select
              value={resourceType}
              onChange={(e) => setResourceType(e.target.value)}
              style={{ padding: "0.75rem 1rem", borderRadius: "0.75rem", border: "1px solid var(--glass-border)", background: "var(--surface)", color: "white" }}
            >
              <option value="">全部類型</option>
              {Object.entries(RESOURCE_TYPE_LABEL).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)" }}>關鍵字搜尋</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="課程名稱、教材、講義"
              style={{ padding: "0.75rem 1rem", borderRadius: "0.75rem", border: "1px solid var(--glass-border)", background: "var(--surface)", color: "white" }}
            />
          </label>
        </div>
      </div>

      {loading && (
        <div className="glass-panel" style={{ padding: "2rem", textAlign: "center" }}>
          正在載入課程內容...
        </div>
      )}

      {error && (
        <div className="glass-panel" style={{ padding: "1.5rem", background: "rgba(239, 68, 68, 0.1)", border: "1px solid var(--danger)", color: "var(--danger)" }}>
          {error}
        </div>
      )}

      {!loading && !error && resources.length === 0 && (
        <div className="glass-panel" style={{ padding: "2rem", textAlign: "center" }}>
          <p style={{ marginBottom: "1rem" }}>目前尚未有符合條件的教材資源。</p>
          <p style={{ color: "rgba(255,255,255,0.7)" }}>
            請確認已在 Supabase `curriculum_resources` 中上架對應年級／科目的教材。若你是導師，可先上傳教材或題庫內容。
          </p>
        </div>
      )}

      <div style={{ display: "grid", gap: "1rem" }}>
        {resources.map((resource) => (
          <article key={resource.id} className="glass-panel hover-scale" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ minWidth: 0 }}>
                <h2 style={{ margin: 0, fontSize: "1.15rem" }}>{resource.title}</h2>
                <p style={{ margin: "0.5rem 0 0", color: "rgba(255,255,255,0.65)" }}>
                  {GRADE_LABEL[resource.grade]} • {CURRICULUM_SUBJECT_LABEL[resource.subject]} • {formatResourceType(resource.type)}
                </p>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", textAlign: "right" }}>
                {resource.publisher && <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.75)" }}>{resource.publisher}</span>}
                {resource.year && <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.75)" }}>{resource.year}</span>}
              </div>
            </div>

            <p style={{ margin: "1rem 0", color: "rgba(255,255,255,0.75)" }}>{getPreviewText(resource)}</p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
              {resource.sourceUrl ? (
                <a
                  href={resource.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                  style={{ textDecoration: "none" }}
                >
                  開啟教材連結
                </a>
              ) : (
                <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem" }}>尚未提供連結</span>
              )}
              {resource.license && <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem" }}>{resource.license}</span>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
