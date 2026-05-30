"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import FocusMonitor from './components/FocusMonitor';
import MasteryMap from './components/MasteryMap';
import { StudentLinkCode } from './components/StudentLinkCode';
import {
  ALL_GRADES,
  ALL_SUBJECTS,
  GRADE_LABEL,
  SUBJECT_LABEL,
  type SchoolGrade,
  type Subject,
} from '@/lib/education';
import {
  getScenario,
  type QuizQuestion,
} from '@/lib/learning-scenarios';

const DIFFICULTY_LABEL: Record<string, string> = {
  Medium: '中等',
  Hard: '困難',
};

export default function StudentPortal() {
  const defaultGrade: SchoolGrade = 'G9';
  const defaultSubject: Subject = 'math';
  const defaultScenario = getScenario(defaultGrade, defaultSubject);

  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(350);
  const [isFocused, setIsFocused] = useState(true);
  const [grade, setGrade] = useState<SchoolGrade>(defaultGrade);
  const [subject, setSubject] = useState<Subject>(defaultSubject);
  
  const [mode, setMode] = useState<'diagnostic' | 'teaching' | 'adaptive'>('teaching');
  const [diagnosticStep, setDiagnosticStep] = useState(0);

  const scenario = useMemo(() => getScenario(grade, subject), [grade, subject]);
  const diagnosticQuestion = scenario.diagnostic.questions[diagnosticStep];

  const [teachingTopic, setTeachingTopic] = useState(() => defaultScenario.teaching.topic);
  const [teachingComplete, setTeachingComplete] = useState(false);

  const [adaptiveIndex, setAdaptiveIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion>(() => defaultScenario.adaptive.questions[0]);

  const resetFlowFor = (nextGrade: SchoolGrade, nextSubject: Subject) => {
    const nextScenario = getScenario(nextGrade, nextSubject);
    setMode('teaching');
    setDiagnosticStep(0);
    setTeachingComplete(false);
    setTeachingTopic(nextScenario.teaching.topic);
    setAdaptiveIndex(0);
    setCurrentQuestion(nextScenario.adaptive.questions[0]);
  };

  const handleDiagnosticAnswer = () => {
    if (diagnosticStep < 1) {
      setDiagnosticStep(prev => prev + 1);
    } else {
      setMode('teaching');
      setTeachingComplete(false);
      alert(`診斷完成！你需要加強「${scenario.diagnostic.title}」。即將開始微課程…`);
    }
  };

  const handleFinishTeaching = () => {
    setTeachingComplete(true);
    setMode('adaptive');
  };

  const handleAdaptiveAnswer = (index: number) => {
    if (index === currentQuestion.correct) {
      setXp((prev) => {
        const next = prev + 50;
        if (next >= level * 400) {
          setLevel((l) => l + 1);
        }
        return next;
      });
      alert("答對了！你正在掌握這個主題。");
      setAdaptiveIndex((prev) => {
        const nextIndex = Math.min(prev + 1, scenario.adaptive.questions.length - 1);
        setCurrentQuestion(scenario.adaptive.questions[nextIndex]);
        return nextIndex;
      });
    } else {
      alert("答錯了，我們回到核心概念再複習一次。");
      setTeachingTopic(scenario.teaching.remedialTopic);
      setTeachingComplete(false);
      setMode('teaching');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="text-gradient">Alpha Tutor</h1>
          <p style={{ color: 'var(--warning)', marginTop: '0.5rem' }}>
            等級 {level} • {xp} XP
          </p>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '0.25rem', fontSize: '0.9rem' }}>
            目前：{GRADE_LABEL[grade]} • {SUBJECT_LABEL[subject]}｜單元：{scenario.diagnostic.title}
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="glass-panel" style={{ padding: '0.5rem 1rem', borderRadius: '999px', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>年級</label>
            <select
              value={grade}
              onChange={(e) => {
                const nextGrade = e.target.value as SchoolGrade;
                setGrade(nextGrade);
                resetFlowFor(nextGrade, subject);
              }}
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
          <div className="glass-panel" style={{ padding: '0.5rem 1rem', borderRadius: '999px', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>科目</label>
            <select
              value={subject}
              onChange={(e) => {
                const nextSubject = e.target.value as Subject;
                setSubject(nextSubject);
                resetFlowFor(grade, nextSubject);
              }}
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
          <StudentLinkCode />
          <div className="glass-panel" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '2rem' }}>
            <span style={{ 
              display: 'inline-block', 
              width: '10px', 
              height: '10px', 
              borderRadius: '50%', 
              backgroundColor: isFocused ? 'var(--accent)' : 'var(--danger)',
              boxShadow: isFocused ? '0 0 10px var(--accent)' : '0 0 10px var(--danger)'
            }}></span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              {isFocused ? '專注中' : '分心'}
            </span>
          </div>
        </div>
      </header>

      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.75)' }}>
            想要查看本週教材、題庫或講義？請點擊「課程內容」。
          </p>
        </div>
        <Link href="/curriculum" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
          前往課程內容
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {(['teaching', 'diagnostic', 'adaptive'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setMode(tab)}
            className={tab === mode ? 'btn-primary' : 'btn-secondary'}
            style={{ minWidth: '140px' }}
            disabled={tab === 'adaptive' && !teachingComplete}
          >
            {tab === 'teaching' ? 'AI 微課程' : tab === 'diagnostic' ? '診斷評量' : '自適應練習'}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '2rem' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="glass-panel hover-scale" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {!isFocused && (
              <div style={{ 
                background: 'rgba(239, 68, 68, 0.1)', 
                border: '1px solid var(--danger)', 
                padding: '1rem', 
                borderRadius: '0.75rem',
                color: 'var(--danger)'
              }}>
                <strong>專注提醒：</strong> 系統偵測到你可能分心了。有效率完成本單元，就能爭取更多自由時間！
              </div>
            )}

            {mode === 'diagnostic' && (
              <div>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--warning)' }}>步驟 1：診斷評量（第 {diagnosticStep + 1}/2 題）</h2>
                <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1rem' }}>
                  正在校準 AI 以符合你的程度（{scenario.diagnostic.title}），題目偏難也別擔心！
                </p>
                <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '0.75rem', fontSize: '1.25rem', textAlign: 'center', border: '1px solid var(--glass-border)' }}>
                  {diagnosticQuestion.text}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '2rem' }}>
                  {diagnosticQuestion.options.map((opt, i) => (
                    <button key={i} className="btn-secondary hover-scale" style={{ padding: '1rem', fontSize: '1.1rem' }} onClick={handleDiagnosticAnswer}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {mode === 'teaching' && (
              <div>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--accent)' }}>步驟 2：AI 微課程</h2>
                <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1rem' }}>觀看約 2 分鐘的「{teachingTopic}」講解</p>
                
                <div style={{ 
                  background: '#000', 
                  aspectRatio: '16/9', 
                  borderRadius: '0.75rem', 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  justifyContent: 'center',
                  border: '1px solid var(--glass-border)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ fontSize: '4rem', opacity: 0.8 }}>▶️</div>
                  <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.6)' }}>[互動動畫：{scenario.diagnostic.title}]</p>
                  
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: 'rgba(255,255,255,0.2)' }}>
                    <div style={{ width: '100%', height: '100%', background: 'var(--primary)', animation: 'progress 10s linear' }}></div>
                  </div>
                </div>

                <style dangerouslySetInnerHTML={{__html: `
                  @keyframes progress {
                    from { width: 0%; }
                    to { width: 100%; }
                  }
                `}} />

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
                  <button className="btn-primary" onClick={handleFinishTeaching} style={{ width: '100%', maxWidth: '300px' }}>
                    我懂了，開始練習！
                  </button>
                </div>
              </div>
            )}

            {mode === 'adaptive' && (
              <div>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>步驟 3：自適應練習</h2>
                <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1rem' }}>
                  {teachingComplete
                    ? "來驗證你是否已掌握這個概念。"
                    : "請先完成微課程再進行練習。"}
                </p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1rem', margin: 0 }}>主題：{teachingTopic}</h3>
                  <span style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.1)' }}>
                    難度：{DIFFICULTY_LABEL[currentQuestion.difficulty] ?? currentQuestion.difficulty}
                  </span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.55)', margin: '-0.25rem 0 1rem', fontSize: '0.85rem' }}>
                  題目進度：第 {adaptiveIndex + 1}/{scenario.adaptive.questions.length} 題
                </p>
                
                <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '0.75rem', fontSize: '1.25rem', textAlign: 'center', border: '1px solid var(--glass-border)' }}>
                  {currentQuestion.text}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '2rem' }}>
                  {currentQuestion.options.map((opt, i) => (
                    <button key={i} className="btn-secondary hover-scale" style={{ padding: '1rem', fontSize: '1.1rem' }} onClick={() => handleAdaptiveAnswer(i)}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

          {(mode === 'adaptive' || mode === 'teaching') && (
            <MasteryMap grade={grade} subject={subject} />
          )}

        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <FocusMonitor onFocusChange={setIsFocused} />
          
          <div className="glass-panel">
            <h3 style={{ marginBottom: '1rem' }}>今日目標</h3>
            <div style={{ background: 'var(--surface)', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
              <div style={{ width: '65%', height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--accent))' }}></div>
            </div>
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', textAlign: 'right', color: 'rgba(255,255,255,0.6)' }}>
              預估剩餘：{isFocused ? '45 分鐘' : '已暫停…'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
