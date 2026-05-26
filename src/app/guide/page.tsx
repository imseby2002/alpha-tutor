"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function GuidePortal() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'upload'>('dashboard');

  const [students] = useState([
    { id: 1, name: 'Alice Chen', status: 'Focused', accuracy: '92%', level: 5, lastEvent: 'Completed Math Module' },
    { id: 2, name: 'Bob Lin', status: 'Distracted', accuracy: '78%', level: 3, lastEvent: 'Left seat for 2 mins' },
    { id: 3, name: 'Charlie Wang', status: 'Focused', accuracy: '88%', level: 4, lastEvent: 'Started English Vocab' },
    { id: 4, name: 'David Lee', status: 'Struggling', accuracy: '45%', level: 2, lastEvent: 'Failed Fraction Q 3x' },
  ]);

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

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem' }}>Guide Dashboard</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem' }}>B2B Center Management & Mentorship View</p>
        </div>
        <Link href="/" className="btn-secondary">Back to Student View</Link>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
        <button 
          onClick={() => setActiveTab('dashboard')} 
          style={{ 
            background: 'none', border: 'none', color: activeTab === 'dashboard' ? 'var(--primary)' : 'rgba(255,255,255,0.6)', 
            fontSize: '1.25rem', fontWeight: 600, cursor: 'pointer', padding: '0.5rem 1rem'
          }}
        >
          Class Monitor
        </button>
        <button 
          onClick={() => setActiveTab('upload')} 
          style={{ 
            background: 'none', border: 'none', color: activeTab === 'upload' ? 'var(--primary)' : 'rgba(255,255,255,0.6)', 
            fontSize: '1.25rem', fontWeight: 600, cursor: 'pointer', padding: '0.5rem 1rem'
          }}
        >
          Upload Custom Materials
        </button>
      </div>

      {activeTab === 'dashboard' ? (
        <>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1rem' }}>Upload Class Worksheets / Quizzes</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Upload your specific school or cram-school materials. The AI will extract the questions and automatically serve them to your students in their next session, dynamically adapting the difficulty.
          </p>

          <label className="btn-primary" style={{ display: 'inline-block', cursor: 'pointer' }}>
            Select Files (PDF/Images)
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
                 {uploadStatus === 'success' ? '✔ Quiz successfully digitized and assigned to your class!' : 'Processing AI extraction...'}
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
