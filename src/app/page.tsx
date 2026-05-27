"use client";

import { useMemo, useState } from 'react';
import FocusMonitor from './components/FocusMonitor';
import MasteryMap from './components/MasteryMap';
import {
  ALL_GRADES,
  ALL_SUBJECTS,
  GRADE_LABEL,
  SUBJECT_LABEL,
  type SchoolGrade,
  type Subject,
} from '@/lib/education';

const DIFFICULTY_LABEL: Record<string, string> = {
  Medium: '中等',
  Hard: '困難',
};

type QuizQuestion = {
  text: string;
  options: string[];
  correct: number;
  difficulty: "Medium" | "Hard";
};

type LearningScenario = {
  diagnostic: {
    title: string;
    question: QuizQuestion;
  };
  teaching: {
    topic: string;
    remedialTopic: string;
  };
  adaptive: {
    questions: QuizQuestion[];
  };
};

function getScenario(grade: SchoolGrade, subject: Subject): LearningScenario {
  // 先提供可用的示範題庫：之後接 Supabase 後可改為從 DB/RAG 取內容
  if (subject === "math") {
    if (grade === "G7" || grade === "G8") {
      return {
        diagnostic: {
          title: "一次方程式",
          question: {
            text: "解 x：3x + 7 = 25",
            options: ["x = 4", "x = 6", "x = 7", "x = 9"],
            correct: 1,
            difficulty: "Medium",
          },
        },
        teaching: { topic: "移項與同類項整理", remedialTopic: "等式兩邊同加同減（概念回顧）" },
        adaptive: {
          questions: [
            {
              text: "解 x：5x - 10 = 15",
              options: ["x = 1", "x = 3", "x = 5", "x = 7"],
              correct: 2,
              difficulty: "Medium",
            },
            {
              text: "解 x：2(x + 4) = 18",
              options: ["x = 3", "x = 5", "x = 7", "x = 9"],
              correct: 1,
              difficulty: "Hard",
            },
          ],
        },
      };
    }

    // 預設（G9 以上）
    return {
      diagnostic: {
        title: "二次方程式",
        question: {
          text: "解 x：x² - 5x + 6 = 0",
          options: ["x = 2 或 3", "x = -2 或 -3", "x = 1 或 6", "無實數解"],
          correct: 0,
          difficulty: "Medium",
        },
      },
      teaching: { topic: "二次方程式（因式分解與公式）", remedialTopic: "配方法與頂點式（圖像直覺）" },
      adaptive: {
        questions: [
          {
            text: "求拋物線頂點：y = 2x² - 8x + 5",
            options: ["(2, -3)", "(4, 5)", "(-2, 3)", "(0, 5)"],
            correct: 0,
            difficulty: "Medium",
          },
          {
            text: "求方程式根：3x² - 12x + 12 = 0",
            options: ["x = 2", "x = 4", "x = -2", "x = 0"],
            correct: 0,
            difficulty: "Hard",
          },
        ],
      },
    };
  }

  if (subject === "english") {
    return {
      diagnostic: {
        title: "基礎字彙與句型",
        question: {
          text: "選出正確句子：",
          options: ["He go to school.", "He goes to school.", "He going to school.", "He goed to school."],
          correct: 1,
          difficulty: "Medium",
        },
      },
      teaching: { topic: "第三人稱單數（-s/-es）", remedialTopic: "主詞與動詞一致（快速複習）" },
      adaptive: {
        questions: [
          {
            text: "選出正確句子：",
            options: ["She like apples.", "She likes apples.", "She liking apples.", "She liked apples (現在式)."],
            correct: 1,
            difficulty: "Medium",
          },
          {
            text: "選出正確句子：",
            options: ["My brother do his homework.", "My brother does his homework.", "My brother doing his homework.", "My brother did his homework (現在式)."],
            correct: 1,
            difficulty: "Hard",
          },
        ],
      },
    };
  }

  if (subject === "chinese") {
    return {
      diagnostic: {
        title: "閱讀理解",
        question: {
          text: "「一鼓作氣」的意思最接近下列哪一項？",
          options: ["慢慢來比較快", "趁勢把事情做完", "反覆嘗試不放棄", "先休息再出發"],
          correct: 1,
          difficulty: "Medium",
        },
      },
      teaching: { topic: "成語語境判讀", remedialTopic: "抓關鍵詞與上下文（技巧回顧）" },
      adaptive: {
        questions: [
          {
            text: "「畫龍點睛」最貼近的用法是？",
            options: ["多此一舉", "關鍵補上一筆使內容更完整", "虎頭蛇尾", "粗心大意"],
            correct: 1,
            difficulty: "Medium",
          },
          {
            text: "「按部就班」最接近下列哪一項？",
            options: ["急於求成", "循序漸進照步驟進行", "隨心所欲", "半途而廢"],
            correct: 1,
            difficulty: "Hard",
          },
        ],
      },
    };
  }

  if (subject === "science") {
    return {
      diagnostic: {
        title: "力與運動",
        question: {
          text: "下列何者最能描述「慣性」？",
          options: ["物體會自己停下來", "物體傾向保持原來運動狀態", "物體一定往下掉", "物體越重越快"],
          correct: 1,
          difficulty: "Medium",
        },
      },
      teaching: { topic: "牛頓第一運動定律", remedialTopic: "受力圖與日常例子（快速回顧）" },
      adaptive: {
        questions: [
          {
            text: "在光滑水平面上推動小車，停止施力後小車會？",
            options: ["立刻停止", "繼續等速前進一段時間", "馬上加速", "改變方向"],
            correct: 1,
            difficulty: "Medium",
          },
          {
            text: "乘車急煞時人會往前傾，主要原因是？",
            options: ["重力變大", "慣性", "摩擦力消失", "空氣阻力變小"],
            correct: 1,
            difficulty: "Hard",
          },
        ],
      },
    };
  }

  // social
  return {
    diagnostic: {
      title: "公民素養",
      question: {
        text: "下列何者屬於「權利」而非「義務」？",
        options: ["依法納稅", "受國民教育", "選舉與被選舉", "服兵役"],
        correct: 2,
        difficulty: "Medium",
      },
    },
    teaching: { topic: "權利與義務的區分", remedialTopic: "生活案例：你擁有的權利有哪些？" },
    adaptive: {
      questions: [
        {
          text: "下列何者最符合「公民參與」？",
          options: ["只在網路抱怨", "依法參與投票或公共討論", "拒絕遵守規則", "完全不關心公共議題"],
          correct: 1,
          difficulty: "Medium",
        },
        {
          text: "當權利與他人權利衝突時，較合理的做法是？",
          options: ["一定要自己贏", "以法律與公共利益做衡量並協調", "都不要管", "交給運氣"],
          correct: 1,
          difficulty: "Hard",
        },
      ],
    },
  };
}

export default function StudentPortal() {
  const defaultGrade: SchoolGrade = 'G9';
  const defaultSubject: Subject = 'math';
  const defaultScenario = getScenario(defaultGrade, defaultSubject);

  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(350);
  const [isFocused, setIsFocused] = useState(true);
  const [grade, setGrade] = useState<SchoolGrade>(defaultGrade);
  const [subject, setSubject] = useState<Subject>(defaultSubject);
  
  const [mode, setMode] = useState<'diagnostic' | 'teaching' | 'adaptive'>('diagnostic');
  const [diagnosticStep, setDiagnosticStep] = useState(0);

  const scenario = useMemo(() => getScenario(grade, subject), [grade, subject]);
  const [teachingTopic, setTeachingTopic] = useState(() => defaultScenario.teaching.topic);
  const [teachingComplete, setTeachingComplete] = useState(false);

  const [adaptiveIndex, setAdaptiveIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion>(() => defaultScenario.adaptive.questions[0]);

  const resetFlowFor = (nextGrade: SchoolGrade, nextSubject: Subject) => {
    const nextScenario = getScenario(nextGrade, nextSubject);
    setMode('diagnostic');
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
            目前：{GRADE_LABEL[grade]} • {SUBJECT_LABEL[subject]}
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
                <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1rem' }}>正在校準 AI 以符合你的程度，題目偏難也別擔心！</p>
                <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '0.75rem', fontSize: '1.25rem', textAlign: 'center', border: '1px solid var(--glass-border)' }}>
                  {scenario.diagnostic.question.text}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '2rem' }}>
                  {scenario.diagnostic.question.options.map((opt, i) => (
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
                  <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.6)' }}>[互動動畫：拋物線作圖]</p>
                  
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
