"use client";

import { useCallback, useMemo, useState } from 'react';
import type { LinkedStudent } from '@/lib/guide-students';
import {
  ALL_GRADES,
  ALL_SUBJECTS,
  GRADE_LABEL,
  SUBJECT_LABEL,
  type SchoolGrade,
  type Subject,
} from '@/lib/education';

type StudentStatus = 'focused' | 'distracted' | 'struggling';

const STATUS_LABEL: Record<StudentStatus, string> = {
  focused: '專注',
  distracted: '分心',
  struggling: '需要協助',
};

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

type Props = {
  initialLinkedStudents: LinkedStudent[];
};

export default function GuidePortalClient({ initialLinkedStudents }: Props) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'upload'>('dashboard');
  const [grade, setGrade] = useState<SchoolGrade>('G9');
  const [subject, setSubject] = useState<Subject>('math');
  const [linkedStudents, setLinkedStudents] = useState<LinkedStudent[]>(initialLinkedStudents);
  const [enrollCode, setEnrollCode] = useState("");
  const [enrollMsg, setEnrollMsg] = useState<string | null>(null);
  const [enrollErr, setEnrollErr] = useState<string | null>(null);

  const loadLinkedStudents = useCallback(async () => {
    const res = await fetch("/api/guide/students");
    const data = await res.json();
    if (res.ok) setLinkedStudents(data.students ?? []);
  }, []);

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnrollMsg(null);
    setEnrollErr(null);
    const res = await fetch("/api/guide/enroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ linkCode: enrollCode }),
    });
    const data = await res.json();
    if (!res.ok) {
      setEnrollErr(data.error ?? "收學生失敗");
      return;
    }
    setEnrollMsg(`已加入學生：${data.student?.display_name ?? "學生"}`);
    setEnrollCode("");
    await loadLinkedStudents();
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

  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'success'>('idle');
  const [progress, setProgress] = useState(0);

  const handleTeacherUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadStatus('uploading');
    
    setTimeout(() => {
      setUploadStatus('processing');
      setProgress(50);
      
      setTimeout(() => {
        setProgress(100);
        setUploadStatus('success');
      }, 2000);
    }, 1500);
  };

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
        </>
      ) : (
        <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1rem' }}>上傳班級講義／測驗</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            上傳學校或補習班專用教材，AI 會自動擷取題目，並在下次學習時依學生程度動態調整難度。
          </p>

          <label className="btn-primary" style={{ display: 'inline-block', cursor: 'pointer' }}>
            選擇檔案（PDF／圖片）
            <input 
              type="file" 
              accept=".pdf,image/*" 
              style={{ display: 'none' }} 
              onChange={handleTeacherUpload}
              disabled={uploadStatus === 'uploading' || uploadStatus === 'processing'}
            />
          </label>

          {uploadStatus !== 'idle' && (
             <div style={{ marginTop: '2rem', maxWidth: '500px', margin: '2rem auto 0', textAlign: 'left' }}>
               <p style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--accent)' }}>
                 {uploadStatus === 'success' ? '✔ 測驗已數位化並指派給你的班級！' : 'AI 擷取處理中…'}
               </p>
               <div style={{ background: 'var(--surface)', borderRadius: '999px', height: '6px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${progress}%`, 
                    height: '100%', 
                    background: uploadStatus === 'success' ? 'var(--accent)' : 'var(--primary)',
                    transition: 'width 0.5s ease'
                  }}></div>
               </div>
             </div>
          )}
        </div>
      )}
    </div>
  );
}
