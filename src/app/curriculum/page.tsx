"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
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
import {
  getTaxonomy,
  TAXONOMY_SUBJECTS,
  TAXONOMY_SUBJECT_LABEL,
  TAXONOMY_SUBJECT_TO_COARSE,
  type TaxonomySubject,
} from "@/lib/subject-taxonomy";
import type { NotebookEntry, NotebookEntryWithResource } from "@/lib/notebook";

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
  const [browseSubject, setBrowseSubject] = useState<TaxonomySubject>("math");
  const [resourceType, setResourceType] = useState<string>("");
  const [search, setSearch] = useState("");
  const [resources, setResources] = useState<CurriculumResource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedResource, setSelectedResource] = useState<CurriculumResource | null>(null);
  const [selectedNote, setSelectedNote] = useState<NotebookEntry | null>(null);
  const [notes, setNotes] = useState<NotebookEntryWithResource[]>([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [notesError, setNotesError] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [noteLoading, setNoteLoading] = useState(false);
  const [noteStatus, setNoteStatus] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);

  const browseCategories = useMemo(() => getTaxonomy(browseSubject), [browseSubject]);
  const browseCoarseSubject = TAXONOMY_SUBJECT_TO_COARSE[browseSubject];

  const handleSelectTopicLabel = (topicLabel: string) => {
    setSubject(browseCoarseSubject);
    setResourceType("");
    setSearch(topicLabel);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const resetNoteState = () => {
    setSelectedNote(null);
    setNoteText("");
    setNoteStatus(null);
    setNoteLoading(false);
    setAiResult(null);
    setShowAiPanel(false);
    setAiLoading(false);
  };

  const fetchNoteList = async (signal?: AbortSignal) => {
    setNotesLoading(true);
    setNotesError(null);

    try {
      const response = await fetch('/api/notebook?list=true', { signal });
      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload?.error || '載入筆記失敗');
      }

      const payload = await response.json();
      setNotes(payload.notes ?? []);
    } catch (error: unknown) {
      if (error instanceof Error && error.name !== 'AbortError') {
        setNotesError(error.message ?? '無法載入筆記');
      }
    } finally {
      setNotesLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    void fetchNoteList(controller.signal);
    return () => controller.abort();
  }, []);

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
      } catch (error: unknown) {
        if (error instanceof Error && error.name !== "AbortError") {
          setError(error.message ?? "無法載入課程內容");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
    return () => controller.abort();
  }, [grade, resourceType, search, subject]);

  useEffect(() => {
    if (!selectedResource) {
      return;
    }

    const controller = new AbortController();
    const fetchNote = async () => {
      setNoteLoading(true);
      setNoteStatus(null);
      try {
        const response = await fetch(`/api/notebook?resourceId=${selectedResource.id}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          const payload = await response.json();
          throw new Error(payload?.error || "無法讀取筆記");
        }
        const payload = await response.json();
        setSelectedNote(payload.note ?? null);
        setNoteText(payload.note?.noteText ?? "");
      } catch (error: unknown) {
        if (error instanceof Error && error.name !== "AbortError") {
          setNoteStatus(error.message ?? "無法讀取筆記");
        }
      } finally {
        setNoteLoading(false);
      }
    };

    fetchNote();
    return () => controller.abort();
  }, [selectedResource]);

  const handleSaveNote = async () => {
    if (!selectedResource) {
      return;
    }

    setNoteLoading(true);
    setNoteStatus(null);

    try {
      const response = await fetch('/api/notebook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resourceId: selectedResource.id,
          noteText,
        }),
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload?.error || '儲存筆記失敗');
      }

      const payload = await response.json();
      setSelectedNote(payload.note ?? null);
      setNoteStatus('筆記已儲存');
      void fetchNoteList();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setNoteStatus(error.message ?? '儲存筆記失敗');
      } else {
        setNoteStatus('儲存筆記失敗');
      }
    } finally {
      setNoteLoading(false);
    }
  };

  const handleAiAssist = async (action: 'summarize' | 'generateQuestions' | 'extractKeywords') => {
    if (!selectedResource || !noteText.trim()) {
      setNoteStatus('請先輸入筆記內容');
      return;
    }

    setAiLoading(true);
    setAiResult(null);
    setShowAiPanel(true);

    try {
      const response = await fetch('/api/notebook', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resourceId: selectedResource.id,
          noteText,
          action,
        }),
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload?.error || 'AI 處理失敗');
      }

      const payload = await response.json();
      setAiResult(payload.result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setNoteStatus(error.message ?? 'AI 處理失敗');
      } else {
        setNoteStatus('AI 處理失敗');
      }
    } finally {
      setAiLoading(false);
    }
  };

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
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setResourceType(e.target.value)}
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
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              placeholder="課程名稱、教材、講義"
              style={{ padding: "0.75rem 1rem", borderRadius: "0.75rem", border: "1px solid var(--glass-border)", background: "var(--surface)", color: "white" }}
            />
          </label>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.15rem', margin: 0 }}>科目細項分類</h2>
          <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>不分年級，依大類 → 小類瀏覽，點小類即可搜尋對應教材</span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {TAXONOMY_SUBJECTS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setBrowseSubject(s)}
              className={s === browseSubject ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
            >
              {TAXONOMY_SUBJECT_LABEL[s]}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', alignItems: 'start' }}>
          {browseCategories.map((category) => (
            <div
              key={category.id}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--glass-border)',
                borderRadius: '0.75rem',
                padding: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ width: '0.4rem', height: '1.05rem', borderRadius: '999px', background: 'var(--primary)' }} />
                <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700 }}>{category.label}</h3>
                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>{category.topics.length}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {category.topics.map((topic) => {
                  const isActive = subject === browseCoarseSubject && search === topic.label;
                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => handleSelectTopicLabel(topic.label)}
                      className="hover-scale"
                      style={{
                        background: isActive ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${isActive ? 'var(--primary)' : 'var(--glass-border)'}`,
                        borderRadius: '999px',
                        padding: '0.3rem 0.7rem',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        color: 'white',
                      }}
                    >
                      {topic.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.1rem' }}>我的筆記</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0.5rem 0 0' }}>
              筆記現在會直接顯示，不用透過「資源類型」下拉選單搜尋。
            </p>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
            {notes.length} 筆筆記
          </span>
        </div>

        <div style={{ marginTop: '1rem', display: 'grid', gap: '0.75rem' }}>
          {notesLoading ? (
            <p style={{ margin: 0 }}>載入筆記...</p>
          ) : notesError ? (
            <p style={{ margin: 0, color: 'rgba(239,68,68,1)' }}>{notesError}</p>
          ) : notes.length === 0 ? (
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.75)' }}>
              目前沒有任何筆記。你可以在教材、題庫或試題項目中開啟「我的筆記」開始記錄。
            </p>
          ) : (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {notes.map((note) => (
                <article key={note.id} className="glass-panel hover-scale" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ minWidth: 0 }}>
                      <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem' }}>{note.resource.title}</h3>
                      <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)' }}>
                        {GRADE_LABEL[note.resource.grade]} • {CURRICULUM_SUBJECT_LABEL[note.resource.subject]} • {formatResourceType(note.resource.type)}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => {
                        resetNoteState();
                        setSelectedResource(note.resource);
                        setSelectedNote(note);
                        setNoteText(note.noteText);
                      }}
                    >
                      開啟筆記
                    </button>
                  </div>
                  <p style={{ margin: '0.75rem 0 0', color: 'rgba(255,255,255,0.75)' }}>
                    {note.noteText ? `${note.noteText.slice(0, 120)}${note.noteText.length > 120 ? '…' : ''}` : '尚未記錄內容'}
                  </p>
                </article>
              ))}
            </div>
          )}
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
              <button
                type="button"
                className={selectedResource?.id === resource.id ? 'btn-primary' : 'btn-secondary'}
                style={{ 
                  minWidth: 'auto',
                  background: selectedResource?.id === resource.id ? 'var(--primary)' : undefined,
                  boxShadow: selectedResource?.id === resource.id ? '0 0 15px rgba(56, 189, 248, 0.5)' : undefined
                }}
                onClick={() => {
                  if (selectedResource?.id === resource.id) {
                    resetNoteState();
                    setSelectedResource(null);
                  } else {
                    resetNoteState();
                    setSelectedResource(resource);
                  }
                }}
              >
                📝 {selectedResource?.id === resource.id ? '關閉筆記' : '我的筆記'}
              </button>
              {resource.license && <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem" }}>{resource.license}</span>}
            </div>
          </article>
        ))}
      </div>

      {selectedResource && (
        <div className="glass-panel" style={{ marginTop: '2rem', padding: '1.5rem', border: '2px solid var(--primary)', boxShadow: '0 0 20px rgba(56, 189, 248, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--primary)' }}>📝 筆記：{selectedResource.title}</h2>
              <p style={{ margin: '0.5rem 0 0', color: 'rgba(255,255,255,0.65)' }}>
                {GRADE_LABEL[selectedResource.grade]} • {CURRICULUM_SUBJECT_LABEL[selectedResource.subject]} • {formatResourceType(selectedResource.type)}
              </p>
            </div>
          </div>

          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="在這裡記錄學習重點、錯題整理、講義摘要..."
            rows={8}
            style={{ width: '100%', padding: '1rem', borderRadius: '1rem', border: '1px solid var(--glass-border)', background: 'var(--surface)', color: 'white', resize: 'vertical', fontSize: '1rem' }}
          />

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem', alignItems: 'center' }}>
            <button type="button" className="btn-primary" onClick={handleSaveNote} disabled={noteLoading}>
              {noteLoading ? '儲存中…' : '💾 儲存筆記'}
            </button>
            
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => setShowAiPanel(!showAiPanel)}
              style={{ 
                background: showAiPanel ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : undefined,
                borderColor: showAiPanel ? '#667eea' : undefined
              }}
            >
              🤖 AI 助手 {showAiPanel ? '▼' : '▶'}
            </button>
            
            <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem' }}>
              {selectedNote ? '✅ 此資源已有歷史筆記' : '✨ 尚未有筆記，開始記錄吧'}
            </span>
            {noteStatus && (
              <span style={{ color: noteStatus.includes('失敗') ? 'var(--danger)' : 'var(--accent)', fontSize: '0.9rem', fontWeight: 600 }}>
                {noteStatus}
              </span>
            )}
          </div>

          {showAiPanel && (
            <div style={{ 
              marginTop: '1.5rem', 
              padding: '1.5rem', 
              borderRadius: '1rem', 
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              border: '1px solid rgba(102, 126, 234, 0.3)'
            }}>
              <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', color: '#667eea' }}>
                ✨ AI 學習助手
              </h3>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => handleAiAssist('summarize')}
                  disabled={aiLoading || !noteText.trim()}
                  style={{ fontSize: '0.9rem' }}
                >
                  📋 重點總結
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => handleAiAssist('generateQuestions')}
                  disabled={aiLoading || !noteText.trim()}
                  style={{ fontSize: '0.9rem' }}
                >
                  ❓ 生成試題
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => handleAiAssist('extractKeywords')}
                  disabled={aiLoading || !noteText.trim()}
                  style={{ fontSize: '0.9rem' }}
                >
                  🔑 關鍵詞提取
                </button>
              </div>

              {aiLoading && (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.6)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
                  <p>AI 正在分析你的筆記...</p>
                </div>
              )}

              {aiResult && (
                <div style={{ 
                  padding: '1rem', 
                  borderRadius: '0.75rem', 
                  background: 'var(--surface)',
                  border: '1px solid var(--glass-border)',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.8',
                  fontSize: '0.95rem'
                }}>
                  {aiResult}
                </div>
              )}

              {!aiLoading && !aiResult && (
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', textAlign: 'center' }}>
                  💡 點擊上方按鈕，讓 AI 幫你分析筆記內容
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
