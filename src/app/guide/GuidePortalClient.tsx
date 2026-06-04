"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { LinkedStudent } from '@/lib/guide-students';
import {
  ALL_GRADES,
  ALL_SUBJECTS,
  GRADE_LABEL,
  SUBJECT_LABEL,
  type SchoolGrade,
  type Subject,
} from '@/lib/education';
import {
  type CurriculumResource,
  type CurriculumResourceType,
  type CurriculumSubject,
  SUBJECT_LABEL as CURRICULUM_SUBJECT_LABEL,
  TAIWAN_CORE_SUBJECTS,
} from '@/lib/curriculum';

type StudentStatus = 'focused' | 'distracted' | 'struggling';

type GuideStudent = {
  id: number;
  name: string;
  status: StudentStatus;
  accuracy: string;
  level: number;
  lastEvent: string;
  grade: SchoolGrade;
  subject: Subject;
};

type GuideClass = {
  id: string;
  name: string;
};

type Props = {
  initialLinkedStudents: LinkedStudent[];
};

const RESOURCE_TYPE_OPTIONS: { value: CurriculumResourceType; label: string }[] = [
  { value: 'textbook', label: '教材' },
  { value: 'questionBank', label: '題庫' },
  { value: 'exam', label: '試題' },
  { value: 'lessonNotes', label: '講義／筆記' },
  { value: 'reference', label: '參考資料' },
];

function formatResourceType(type: CurriculumResourceType) {
  return RESOURCE_TYPE_OPTIONS.find((item) => item.value === type)?.label ?? type;
}

export default function GuidePortalClient({ initialLinkedStudents }: Props) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'upload'>('dashboard');
  const [grade, setGrade] = useState<SchoolGrade>('G9');
  const [subject, setSubject] = useState<Subject>('math');
  const [linkedStudents, setLinkedStudents] = useState<LinkedStudent[]>(initialLinkedStudents);
  const [enrollCode, setEnrollCode] = useState('');
  const [enrollMsg, setEnrollMsg] = useState<string | null>(null);
  const [enrollErr, setEnrollErr] = useState<string | null>(null);

  const [classes, setClasses] = useState<GuideClass[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [guideResources, setGuideResources] = useState<CurriculumResource[]>([]);
  const [resourceError, setResourceError] = useState<string | null>(null);

  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadType, setUploadType] = useState<CurriculumResourceType>('textbook');
  const [uploadGrade, setUploadGrade] = useState<SchoolGrade>('G9');
  const [uploadSubject, setUploadSubject] = useState<CurriculumSubject>('math');
  const [uploadSourceUrl, setUploadSourceUrl] = useState('');
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'failed'>('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const loadLinkedStudents = useCallback(async () => {
    const res = await fetch('/api/guide/students');
    const data = await res.json();
    if (res.ok) setLinkedStudents(data.students ?? []);
  }, []);

  const loadGuideData = useCallback(async () => {
    setResourceError(null);
    try {
      const [classesRes, resourcesRes] = await Promise.all([
        fetch('/api/guide/classes'),
        fetch('/api/guide/materials'),
      ]);

      const classesJson = await classesRes.json();
      if (classesRes.ok) {
        setClasses(classesJson.classes ?? []);
        setSelectedClassId((current) => {
          if (current) return current;
          if (Array.isArray(classesJson.classes) && classesJson.classes.length > 0) {
            return classesJson.classes[0].id;
          }
          return current;
        });
      }

      const resourcesJson = await resourcesRes.json();
      if (resourcesRes.ok) {
        setGuideResources(resourcesJson.resources ?? []);
      } else {
        setResourceError(resourcesJson.error ?? '無法載入已上架教材');
      }
    } catch {
      setResourceError('無法載入導師資料');
    }
  }, []);

  useEffect(() => {
    async function initGuideData() {
      await loadGuideData();
    }
    void initGuideData();
  }, [loadGuideData]);

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnrollMsg(null);
    setEnrollErr(null);
    const res = await fetch('/api/guide/enroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ linkCode: enrollCode }),
    });
    const data = await res.json();
    if (!res.ok) {
      setEnrollErr(data.error ?? '收學生失敗');
      return;
    }
    setEnrollMsg(`已加入學生：${data.student?.display_name ?? '學生'}`);
    setEnrollCode('');
    await loadLinkedStudents();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFileToUpload(selected);
    e.target.value = '';
  };

  const handleUploadReset = () => {
    setUploadTitle('');
    setUploadDescription('');
    setUploadType('textbook');
    setUploadGrade('G9');
    setUploadSubject('math');
    setUploadSourceUrl('');
    setFileToUpload(null);
    setUploadStatus('idle');
    setUploadError(null);
    setUploadSuccess(null);
  };

  const handleUploadSubmit = async () => {
    setUploadError(null);
    setUploadSuccess(null);

    if (!uploadTitle.trim()) {
      setUploadError('請填寫教材標題');
      return;
    }

    if (!selectedClassId) {
      setUploadError('請選擇班級');
      return;
    }

    if (!fileToUpload && !uploadSourceUrl.trim()) {
      setUploadError('請上傳教材檔案或填寫外部連結');
      return;
    }

    setUploadStatus('uploading');

    const formData = new FormData();
    formData.append('title', uploadTitle.trim());
    formData.append('description', uploadDescription.trim());
    formData.append('type', uploadType);
    formData.append('grade', uploadGrade);
    formData.append('subject', uploadSubject);
    formData.append('sourceUrl', uploadSourceUrl.trim());
    formData.append('classId', selectedClassId);
    if (fileToUpload) {
      formData.append('file', fileToUpload);
    }

    const res = await fetch('/api/guide/materials', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();

    if (!res.ok) {
      setUploadStatus('failed');
      setUploadError(data.error || '上傳失敗');
      return;
    }

    setUploadStatus('success');
    setUploadSuccess(`已上架：${data.resource?.title ?? '教材'}`);
    handleUploadReset();
    void loadGuideData();
  };

  const [students] = useState<GuideStudent[]>([
    { id: 1, name: '陳小愛', status: 'focused', accuracy: '92%', level: 5, lastEvent: '完成數學單元', grade: 'G9', subject: 'math' },
    { id: 2, name: '林柏宇', status: 'distracted', accuracy: '78%', level: 3, lastEvent: '離座 2 分鐘', grade: 'G9', subject: 'math' },
    { id: 3, name: '王查理', status: 'focused', accuracy: '88%', level: 4, lastEvent: '開始英文單字練習', grade: 'G8', subject: 'english' },
    { id: 4, name: '李大衛', status: 'struggling', accuracy: '45%', level: 2, lastEvent: '分數題連錯 3 次', grade: 'G7', subject: 'math' },
  ]);

  const filteredStudents = useMemo(
    () => students.filter((s) => s.grade === grade && s.subject === subject),
    [students, grade, subject]
  );

  const statusStyle = (status: StudentStatus) => {
    if (status === 'focused') return { bg: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent)' };
    if (status === 'distracted') return { bg: 'rgba(245, 158, 11, 0.2)', color: 'var(--warning)' };
    return { bg: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)' };
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem' }}>導師儀表板</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem' }}>
            補習班管理與學生輔導視圖
          </p>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '0.25rem', fontSize: '0.9rem' }}>
            目前班級：{GRADE_LABEL[grade]} • {SUBJECT_LABEL[subject]}
          </p>
        </div>
      </header>

      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>收學生（帳號連結）</h2>
        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1rem' }}>
          輸入學生的 8 碼綁定碼，即可加入你的預設班級。一位導師可管理多位學生。
        </p>
        <form onSubmit={handleEnroll} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <input
            value={enrollCode}
            onChange={(e) => setEnrollCode(e.target.value.toUpperCase())}
            placeholder="學生綁定碼"
            maxLength={8}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              border: '1px solid var(--glass-border)',
              background: 'var(--surface)',
              color: 'white',
            }}
          />
          <button type="submit" className="btn-primary">加入班級</button>
        </form>
        {enrollMsg && <p style={{ color: 'var(--accent)', marginTop: '0.75rem' }}>{enrollMsg}</p>}
        {enrollErr && <p style={{ color: 'var(--danger)', marginTop: '0.75rem' }}>{enrollErr}</p>}
        {linkedStudents.length > 0 && (
          <div style={{ marginTop: '1.25rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' }}>
              已連結 {linkedStudents.length} 位學生：
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {linkedStudents.map((s) => (
                <span
                  key={s.id}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '999px',
                    background: 'rgba(255,255,255,0.08)',
                    fontSize: '0.85rem',
                  }}
                >
                  {s.display_name ?? '學生'} · Lv.{s.level} · {s.class_name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <button 
          onClick={() => setActiveTab('dashboard')} 
          style={{ 
            background: 'none', border: 'none', color: activeTab === 'dashboard' ? 'var(--primary)' : 'rgba(255,255,255,0.6)', 
            fontSize: '1.25rem', fontWeight: 600, cursor: 'pointer', padding: '0.5rem 1rem'
          }}
        >
          班級監控
        </button>
        <button 
          onClick={() => setActiveTab('upload')} 
          style={{ 
            background: 'none', border: 'none', color: activeTab === 'upload' ? 'var(--primary)' : 'rgba(255,255,255,0.6)', 
            fontSize: '1.25rem', fontWeight: 600, cursor: 'pointer', padding: '0.5rem 1rem'
          }}
        >
          上傳自訂教材
        </button>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>篩選條件：</span>
          <div className="glass-panel" style={{ padding: '0.4rem 0.75rem', borderRadius: '999px', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>年級</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value as SchoolGrade)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '0.85rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {ALL_GRADES.map((g) => (
                <option key={g} value={g} style={{ color: 'black' }}>
                  {GRADE_LABEL[g]}
                </option>
              ))}
            </select>
          </div>
          <div className="glass-panel" style={{ padding: '0.4rem 0.75rem', borderRadius: '999px', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>科目</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value as Subject)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '0.85rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {ALL_SUBJECTS.map((s) => (
                <option key={s} value={s} style={{ color: 'black' }}>
                  {SUBJECT_LABEL[s]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {activeTab === 'dashboard' ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            <div className="glass-panel hover-scale">
              <h3 style={{ color: 'rgba(255,255,255,0.6)' }}>在線學生</h3>
              <p style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0.5rem 0' }}>{filteredStudents.length}</p>
            </div>
            <div className="glass-panel hover-scale">
              <h3 style={{ color: 'rgba(255,255,255,0.6)' }}>平均專注度</h3>
              <p style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0.5rem 0', color: 'var(--accent)' }}>87%</p>
            </div>
            <div className="glass-panel hover-scale" style={{ border: '1px solid var(--danger)' }}>
              <h3 style={{ color: 'var(--danger)' }}>需介入輔導</h3>
              <p style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0.5rem 0' }}>
                {filteredStudents.filter((s) => s.status === 'struggling').length}
              </p>
            </div>
          </div>

          <h2 style={{ marginBottom: '1.5rem' }}>班級名單與即時狀態（Layer 2 事件）</h2>
          <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)' }}>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>學生</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>目前狀態</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>正確率</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>最新 AI 洞察</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => {
                  const style = statusStyle(student.status);
                  return (
                  <tr key={student.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ fontWeight: 600 }}>{student.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                        等級 {student.level}｜{GRADE_LABEL[student.grade]}｜{SUBJECT_LABEL[student.subject]}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '1rem', 
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        background: style.bg,
                        color: style.color
                      }}>
                        {STATUS_LABEL[student.status]}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>{student.accuracy}</td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                      {student.lastEvent}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {guideResources.length > 0 && (
            <div className="glass-panel" style={{ marginTop: '2rem', padding: '1.5rem' }}>
              <h2 style={{ marginBottom: '1rem' }}>已上架教材預覽</h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {guideResources.slice(0, 3).map((resource) => (
                  <div key={resource.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.65)' }}>
                        {GRADE_LABEL[resource.grade]} • {CURRICULUM_SUBJECT_LABEL[resource.subject]} • {formatResourceType(resource.type)}
                      </p>
                      <h3 style={{ margin: '0.35rem 0 0', fontSize: '1.05rem' }}>{resource.title}</h3>
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem' }}>{resource.publisher || '教師上傳'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1rem' }}>上傳班級講義／測驗</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            上傳學校或補習班專用教材，AI 會自動擷取題目，並在下次學習時依學生程度動態調整難度。
          </p>

          <div style={{ display: 'grid', gap: '1rem', maxWidth: '680px', margin: '0 auto 1.5rem', textAlign: 'left' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)' }}>對應班級</span>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                style={{ padding: '0.9rem 1rem', borderRadius: '0.75rem', border: '1px solid var(--glass-border)', background: 'var(--surface)', color: 'white' }}
              >
                <option value="">請選擇班級</option>
                {classes.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)' }}>年級</span>
                <select
                  value={uploadGrade}
                  onChange={(e) => setUploadGrade(e.target.value as SchoolGrade)}
                  style={{ padding: '0.9rem 1rem', borderRadius: '0.75rem', border: '1px solid var(--glass-border)', background: 'var(--surface)', color: 'white' }}
                >
                  {ALL_GRADES.map((g) => (
                    <option key={g} value={g}>{GRADE_LABEL[g]}</option>
                  ))}
                </select>
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)' }}>科目</span>
                <select
                  value={uploadSubject}
                  onChange={(e) => setUploadSubject(e.target.value as CurriculumSubject)}
                  style={{ padding: '0.9rem 1rem', borderRadius: '0.75rem', border: '1px solid var(--glass-border)', background: 'var(--surface)', color: 'white' }}
                >
                  {TAIWAN_CORE_SUBJECTS.map((s) => (
                    <option key={s} value={s}>{CURRICULUM_SUBJECT_LABEL[s]}</option>
                  ))}
                </select>
              </label>
            </div>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)' }}>教材類型</span>
              <select
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value as CurriculumResourceType)}
                style={{ padding: '0.9rem 1rem', borderRadius: '0.75rem', border: '1px solid var(--glass-border)', background: 'var(--surface)', color: 'white' }}
              >
                {RESOURCE_TYPE_OPTIONS.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)' }}>教材標題</span>
              <input
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="例如：第二冊數學講義"
                style={{ padding: '0.9rem 1rem', borderRadius: '0.75rem', border: '1px solid var(--glass-border)', background: 'var(--surface)', color: 'white' }}
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)' }}>說明</span>
              <textarea
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
                placeholder="可填寫教材重點、來源、適用章節"
                rows={4}
                style={{ padding: '0.9rem 1rem', borderRadius: '0.75rem', border: '1px solid var(--glass-border)', background: 'var(--surface)', color: 'white', resize: 'vertical' }}
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)' }}>教材檔案</span>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={handleFileSelect}
                style={{ padding: '0.9rem 1rem', borderRadius: '0.75rem', border: '1px solid var(--glass-border)', background: 'var(--surface)', color: 'white' }}
              />
              {fileToUpload && <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem' }}>{fileToUpload.name}</span>}
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)' }}>外部連結（選填）</span>
              <input
                value={uploadSourceUrl}
                onChange={(e) => setUploadSourceUrl(e.target.value)}
                placeholder="教材雲端連結或題庫網址"
                style={{ padding: '0.9rem 1rem', borderRadius: '0.75rem', border: '1px solid var(--glass-border)', background: 'var(--surface)', color: 'white' }}
              />
            </label>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleUploadReset}
                disabled={uploadStatus === 'uploading'}
              >
                清除
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleUploadSubmit}
                disabled={uploadStatus === 'uploading'}
              >
                {uploadStatus === 'uploading' ? '上傳中…' : '上傳教材'}
              </button>
            </div>

            {uploadError && <p style={{ color: 'var(--danger)', marginTop: '0.5rem' }}>{uploadError}</p>}
            {uploadSuccess && <p style={{ color: 'var(--accent)', marginTop: '0.5rem' }}>{uploadSuccess}</p>}
          </div>

          {resourceError && (
            <div className="glass-panel" style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(239,68,68,0.12)', border: '1px solid var(--danger)' }}>
              <p style={{ margin: 0, color: 'var(--danger)' }}>{resourceError}</p>
            </div>
          )}

          {guideResources.length > 0 && (
            <div style={{ marginTop: '2rem', maxWidth: '920px', marginLeft: 'auto', marginRight: 'auto' }}>
              <h3 style={{ marginBottom: '1rem' }}>已上架教材</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {guideResources.map((resource) => (
                  <div key={resource.id} className="glass-panel" style={{ padding: '1rem', borderRadius: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.65)' }}>
                          {GRADE_LABEL[resource.grade]} • {CURRICULUM_SUBJECT_LABEL[resource.subject]} • {formatResourceType(resource.type)}
                        </p>
                        <h4 style={{ margin: '0.35rem 0 0', fontSize: '1.05rem' }}>{resource.title}</h4>
                      </div>
                      <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)' }}>{resource.publisher || '教師上傳'}</span>
                    </div>
                    <p style={{ margin: '0.75rem 0 0', color: 'rgba(255,255,255,0.7)' }}>{resource.description ?? '未提供說明。'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
