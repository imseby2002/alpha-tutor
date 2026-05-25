"use client";

import { useState, useEffect } from 'react';
import FocusMonitor from './components/FocusMonitor';

export default function StudentPortal() {
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(350);
  const [isFocused, setIsFocused] = useState(true);

  // Mock adaptive question logic
  const [currentQuestion, setCurrentQuestion] = useState({
    text: "Calculate the vertex of the parabola: y = 2x² - 8x + 5",
    options: ["(2, -3)", "(4, 5)", "(-2, 3)", "(0, 5)"],
    correct: 0
  });

  const handleAnswer = (index: number) => {
    if (index === currentQuestion.correct) {
      setXp(xp + 50);
      alert("Correct! Adaptive difficulty increasing...");
      // In a real app, we'd fetch the next question from RAG/LLM backend
    } else {
      alert("Incorrect. The Edge LLM will now break this down into smaller steps.");
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
          <button className="btn-secondary">View Mastery Map</button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        
        {/* Main Learning Area */}
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

          <div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Current Task: Quadratic Equations</h2>
            <div style={{ 
              background: 'var(--surface)', 
              padding: '2rem', 
              borderRadius: '0.75rem', 
              fontSize: '1.25rem',
              textAlign: 'center',
              border: '1px solid var(--glass-border)'
            }}>
              {currentQuestion.text}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {currentQuestion.options.map((opt, i) => (
              <button 
                key={i} 
                className="btn-secondary hover-scale"
                style={{ padding: '1rem', fontSize: '1.1rem' }}
                onClick={() => handleAnswer(i)}
              >
                {opt}
              </button>
            ))}
          </div>
          
          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center' }}>
            <button className="btn-primary" style={{ width: '100%', maxWidth: '300px' }}>
              Need a Hint from Edge AI?
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <FocusMonitor onFocusChange={setIsFocused} />

          <div className="glass-panel">
            <h3 style={{ marginBottom: '1rem' }}>Today's Goal</h3>
            <div style={{ background: 'var(--surface)', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
              <div style={{ width: '65%', height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--accent))' }}></div>
            </div>
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', textAlign: 'right', color: 'rgba(255,255,255,0.6)' }}>
              Est. time remaining: 45 mins
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
