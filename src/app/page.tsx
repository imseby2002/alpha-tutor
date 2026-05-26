"use client";

import { useState } from 'react';
import FocusMonitor from './components/FocusMonitor';
import MasteryMap from './components/MasteryMap';

export default function StudentPortal() {
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(350);
  const [isFocused, setIsFocused] = useState(true);
  
  // App States: 'diagnostic' | 'teaching' | 'adaptive'
  const [mode, setMode] = useState<'diagnostic' | 'teaching' | 'adaptive'>('diagnostic');
  const [diagnosticStep, setDiagnosticStep] = useState(0);

  // Teaching State
  const [teachingTopic, setTeachingTopic] = useState("Quadratic Equations");
  const [teachingComplete, setTeachingComplete] = useState(false);

  // Mock adaptive question logic
  const [currentQuestion, setCurrentQuestion] = useState({
    text: "Calculate the vertex of the parabola: y = 2x² - 8x + 5",
    options: ["(2, -3)", "(4, 5)", "(-2, 3)", "(0, 5)"],
    correct: 0,
    difficulty: "Medium"
  });

  const handleDiagnosticAnswer = () => {
    if (diagnosticStep < 1) {
      setDiagnosticStep(prev => prev + 1);
    } else {
      // After diagnostic, we know what they need to learn, so we start teaching!
      setMode('teaching');
      setTeachingComplete(false);
      alert("Diagnostic complete! You need to learn about Quadratic Equations. Starting the micro-lesson...");
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
      alert("Correct! You are mastering this topic.");
      setCurrentQuestion({
        text: "Determine the roots of the equation: 3x² - 12x + 12 = 0",
        options: ["x = 2", "x = 4", "x = -2", "x = 0"],
        correct: 0,
        difficulty: "Hard"
      });
    } else {
      alert("Incorrect. Let's step back and review the core concept again.");
      // Drop back to teaching mode to re-explain
      setTeachingTopic("Vertex Formula (-b/2a) Explained visually");
      setTeachingComplete(false);
      setMode('teaching');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="text-gradient">Alpha Tutor</h1>
          <p style={{ color: 'var(--warning)', marginTop: '0.5rem' }}>Level {level} • {xp} XP</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
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
              {isFocused ? 'Focused' : 'Distracted'}
            </span>
          </div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        
        {/* Main Learning Area */}
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
                <strong>Attention Alert:</strong> We noticed you might be distracted. Remember, finishing this module efficiently earns you more free time!
              </div>
            )}

            {mode === 'diagnostic' && (
              <div>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--warning)' }}>Step 1: Diagnostic Assessment (Question {diagnosticStep + 1}/2)</h2>
                <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1rem' }}>We are calibrating the AI to your exact level. Don&apos;t worry if it&apos;s hard!</p>
                <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '0.75rem', fontSize: '1.25rem', textAlign: 'center', border: '1px solid var(--glass-border)' }}>
                  Solve for x: 5x + 15 = 40
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '2rem' }}>
                  {["x = 3", "x = 5", "x = 7", "x = 25"].map((opt, i) => (
                    <button key={i} className="btn-secondary hover-scale" style={{ padding: '1rem', fontSize: '1.1rem' }} onClick={handleDiagnosticAnswer}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {mode === 'teaching' && (
              <div>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--accent)' }}>Step 2: AI Micro-Learning</h2>
                <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1rem' }}>Watch this 2-minute explanation of {teachingTopic}</p>
                
                {/* Mock Video / Interactive Diagram Player */}
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
                  <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.6)' }}>[Interactive Animation: Graphing a Parabola]</p>
                  
                  {/* Mock progress bar */}
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
                    I understand, let&apos;s practice!
                  </button>
                </div>
              </div>
            )}

            {mode === 'adaptive' && (
              <div>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Step 3: Adaptive Practice</h2>
                <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1rem' }}>
                  {teachingComplete
                    ? "Let\u2019s see if you mastered the concept."
                    : "Complete the micro-lesson before practice."}
                </p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1rem', margin: 0 }}>Topic: {teachingTopic}</h3>
                  <span style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.1)' }}>Difficulty: {currentQuestion.difficulty}</span>
                </div>
                
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

          {/* Mastery Map Visualization */}
          {(mode === 'adaptive' || mode === 'teaching') && <MasteryMap />}

        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <FocusMonitor onFocusChange={setIsFocused} />
          
          <div className="glass-panel">
            <h3 style={{ marginBottom: '1rem' }}>Today&apos;s Goal</h3>
            <div style={{ background: 'var(--surface)', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
              <div style={{ width: '65%', height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--accent))' }}></div>
            </div>
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', textAlign: 'right', color: 'rgba(255,255,255,0.6)' }}>
              Est. time remaining: {isFocused ? '45 mins' : 'Paused...'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
