"use client";

import { useState } from 'react';

export default function AdminPortal() {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'success'>('idle');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploadStatus('uploading');
    setLogs(["[SYSTEM] Uploading PDF document..."]);
    
    setTimeout(() => {
      setUploadStatus('processing');
      setLogs(prev => [...prev, "[AI] Running OCR extraction...", "[AI] Chunking text into context windows..."]);
      setProgress(30);
      
      setTimeout(() => {
        setLogs(prev => [...prev, "[AI] Extracting Knowledge Nodes (e.g. Algebra, Geometry)..."]);
        setProgress(60);
        
        setTimeout(() => {
          setLogs(prev => [...prev, "[SYSTEM] Mapping nodes to Global Mastery Graph...", "[SYSTEM] Vector Database updated successfully."]);
          setProgress(100);
          setUploadStatus('success');
        }, 2000);
      }, 2000);
    }, 1500);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '2.5rem' }}>Platform Admin</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem' }}>Global Curriculum & Knowledge Graph Management</p>
      </header>

      <div style={{ display: 'grid', gap: '2rem' }}>
        <div className="glass-panel" style={{ borderStyle: 'dashed', borderWidth: '2px', borderColor: 'var(--primary)', textAlign: 'center', padding: '4rem 2rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Upload Official Textbooks (PDF/Docx)</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>
            The AI will automatically extract concepts, generate adaptive questions, and expand the global Mastery Map.
          </p>
          
          <label className="btn-primary" style={{ display: 'inline-block', cursor: 'pointer' }}>
            Select Files to Ingest
            <input 
              type="file" 
              accept=".pdf,.docx" 
              style={{ display: 'none' }} 
              onChange={handleFileUpload}
              disabled={uploadStatus === 'uploading' || uploadStatus === 'processing'}
            />
          </label>
        </div>

        {uploadStatus !== 'idle' && (
          <div className="glass-panel" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>⚙️</span> RAG Pipeline Status
            </h3>
            
            <div style={{ background: 'var(--surface)', borderRadius: '999px', height: '10px', overflow: 'hidden', marginBottom: '1rem' }}>
              <div style={{ 
                width: `${progress}%`, 
                height: '100%', 
                background: uploadStatus === 'success' ? 'var(--accent)' : 'var(--primary)',
                transition: 'width 0.5s ease'
              }}></div>
            </div>

            <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', background: '#000', padding: '1rem', borderRadius: '0.5rem' }}>
              {logs.map((log, index) => (
                <div key={index} style={{ marginBottom: '0.25rem', color: log.includes('[success]') || uploadStatus === 'success' && index === logs.length - 1 ? 'var(--accent)' : 'inherit' }}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
