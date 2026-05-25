"use client";

import Link from 'next/link';

export default function ParentPortal() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2rem' }}>Parent Portal</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem' }}>Daily Summary & Insights</p>
        </div>
        <Link href="/" className="btn-secondary">Switch to Student View</Link>
      </header>

      <div className="glass-panel hover-scale" style={{ marginBottom: '2rem', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid var(--primary)' }}>
        <h2 style={{ color: 'var(--primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>✨</span> AI Daily Report for Alice
        </h2>
        <p style={{ lineHeight: '1.6', color: 'rgba(255,255,255,0.9)' }}>
          Alice had a highly productive session today! She mastered <strong>Quadratic Equations</strong> in record time with 92% accuracy. 
          Her focus monitor reported a strong <strong>88% attention score</strong>. 
          <br /><br />
          <strong>AI Suggestion:</strong> She struggled slightly with word problems involving trajectories. We will assign 2 short review questions on this tomorrow. 
          Praise her for earning 150 XP today!
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'rgba(255,255,255,0.7)' }}>Study Time (Today)</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700 }}>45 <span style={{ fontSize: '1rem', fontWeight: 400, color: 'rgba(255,255,255,0.5)' }}>mins</span></p>
          <div style={{ marginTop: '0.5rem', background: 'var(--surface)', borderRadius: '999px', height: '6px' }}>
            <div style={{ width: '100%', height: '100%', background: 'var(--accent)', borderRadius: '999px' }}></div>
          </div>
          <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--accent)' }}>Daily goal completed 15 mins early!</p>
        </div>

        <div className="glass-panel">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'rgba(255,255,255,0.7)' }}>Mastery Progress</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700 }}>Level 5</p>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            {[1, 2, 3, 4, 5].map((level) => (
              <div key={level} style={{ 
                flex: 1, 
                height: '8px', 
                borderRadius: '4px', 
                background: level <= 5 ? 'var(--primary)' : 'var(--surface)' 
              }}></div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-panel">
        <h3 style={{ marginBottom: '1.5rem' }}>Weakness Radar (Layer 3 LLM Analysis)</h3>
        <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
          {[
            { topic: 'Algebra', score: 95 },
            { topic: 'Geometry', score: 80 },
            { topic: 'Word Problems', score: 65, alert: true }
          ].map((item, i) => (
             <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ width: '120px', color: item.alert ? 'var(--warning)' : 'inherit' }}>{item.topic}</span>
                <div style={{ flex: 1, background: 'var(--surface)', height: '10px', borderRadius: '5px' }}>
                  <div style={{ 
                    width: `${item.score}%`, 
                    height: '100%', 
                    background: item.alert ? 'var(--warning)' : 'var(--primary)',
                    borderRadius: '5px'
                  }}></div>
                </div>
                <span style={{ width: '40px', textAlign: 'right', fontWeight: 600 }}>{item.score}%</span>
             </div>
          ))}
        </div>
      </div>

    </div>
  );
}
