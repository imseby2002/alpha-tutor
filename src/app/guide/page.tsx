"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function GuidePortal() {
  const [students, setStudents] = useState([
    { id: 1, name: 'Alice Chen', status: 'Focused', accuracy: '92%', level: 5, lastEvent: 'Completed Math Module' },
    { id: 2, name: 'Bob Lin', status: 'Distracted', accuracy: '78%', level: 3, lastEvent: 'Left seat for 2 mins' },
    { id: 3, name: 'Charlie Wang', status: 'Focused', accuracy: '88%', level: 4, lastEvent: 'Started English Vocab' },
    { id: 4, name: 'David Lee', status: 'Struggling', accuracy: '45%', level: 2, lastEvent: 'Failed Fraction Q 3x' },
  ]);

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem' }}>Guide Dashboard</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem' }}>B2B Center Management & Mentorship View</p>
        </div>
        <Link href="/" className="btn-secondary">Back to Student View</Link>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-panel hover-scale">
          <h3 style={{ color: 'rgba(255,255,255,0.6)' }}>Active Students</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0.5rem 0' }}>24</p>
        </div>
        <div className="glass-panel hover-scale">
          <h3 style={{ color: 'rgba(255,255,255,0.6)' }}>Average Focus</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0.5rem 0', color: 'var(--accent)' }}>87%</p>
        </div>
        <div className="glass-panel hover-scale" style={{ border: '1px solid var(--danger)' }}>
          <h3 style={{ color: 'var(--danger)' }}>Requires Intervention</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0.5rem 0' }}>2</p>
        </div>
      </div>

      <h2 style={{ marginBottom: '1.5rem' }}>Class Roster & Real-time Status (Layer 2 Events)</h2>
      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)' }}>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Student</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Current Status</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Accuracy</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Latest Cloud LLM Insight</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <div style={{ fontWeight: 600 }}>{student.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>Level {student.level}</div>
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '1rem', 
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    background: student.status === 'Focused' ? 'rgba(16, 185, 129, 0.2)' : 
                                student.status === 'Distracted' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: student.status === 'Focused' ? 'var(--accent)' : 
                           student.status === 'Distracted' ? 'var(--warning)' : 'var(--danger)'
                  }}>
                    {student.status}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>{student.accuracy}</td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                  {student.lastEvent}
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                    View Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
