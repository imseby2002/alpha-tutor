"use client";

import { useState } from 'react';

// A mock data structure for the Mastery Map
const initialNodes = [
  { id: 'math-1', label: 'Basic Addition', status: 'mastered', x: 50, y: 50 },
  { id: 'math-2', label: 'Fractions', status: 'mastered', x: 150, y: 100 },
  { id: 'math-3', label: 'Algebra Basics', status: 'in-progress', x: 250, y: 50 },
  { id: 'math-4', label: 'Quadratic Equations', status: 'locked', x: 350, y: 100 },
  { id: 'math-5', label: 'Calculus Intro', status: 'locked', x: 450, y: 50 },
];

export default function MasteryMap() {
  const [nodes] = useState(initialNodes);

  return (
    <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>🗺️</span> Your Mastery Map
      </h2>
      <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>
        Unlock new knowledge nodes by achieving 90%+ accuracy on the current topic.
      </p>

      <div style={{ 
        position: 'relative', 
        height: '200px', 
        background: 'rgba(0,0,0,0.2)', 
        borderRadius: '1rem',
        overflow: 'hidden',
        border: '1px solid var(--glass-border)'
      }}>
        {/* Draw connection lines (mocked) */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <path d="M 50 50 Q 100 100 150 100 T 250 50 T 350 100 T 450 50" 
                fill="transparent" 
                stroke="var(--glass-border)" 
                strokeWidth="3" 
                strokeDasharray="5,5" />
          <path d="M 50 50 Q 100 100 150 100 T 250 50" 
                fill="transparent" 
                stroke="var(--accent)" 
                strokeWidth="4" />
        </svg>

        {/* Render nodes */}
        {nodes.map(node => (
          <div key={node.id} className="hover-scale" style={{
            position: 'absolute',
            left: `${node.x}px`,
            top: `${node.y}px`,
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: node.status === 'locked' ? 'not-allowed' : 'pointer'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: node.status === 'mastered' ? 'var(--accent)' :
                          node.status === 'in-progress' ? 'var(--primary)' : 'var(--surface)',
              border: `2px solid ${node.status === 'in-progress' ? 'white' : 'transparent'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: node.status === 'in-progress' ? '0 0 15px var(--primary)' : 'none',
              transition: 'all 0.3s ease'
            }}>
              {node.status === 'mastered' ? '✓' : node.status === 'locked' ? '🔒' : '🎯'}
            </div>
            <span style={{ 
              fontSize: '0.75rem', 
              fontWeight: 600,
              color: node.status === 'locked' ? 'rgba(255,255,255,0.4)' : 'white',
              background: 'rgba(0,0,0,0.6)',
              padding: '0.2rem 0.5rem',
              borderRadius: '0.5rem',
              whiteSpace: 'nowrap'
            }}>
              {node.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
