"use client";

import { useState } from 'react';

export default function AdminPortal() {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'success'>('idle');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploadStatus('uploading');
    setLogs(["[系統] 正在上傳 PDF 文件…"]);
    
    setTimeout(() => {
      setUploadStatus('processing');
      setLogs(prev => [...prev, "[AI] 執行 OCR 擷取…", "[AI] 切分文字區塊…"]);
      setProgress(30);
      
      setTimeout(() => {
        setLogs(prev => [...prev, "[AI] 擷取知識節點（代數、幾何等）…"]);
        setProgress(60);
        
        setTimeout(() => {
          setLogs(prev => [...prev, "[系統] 對應至全域精通圖…", "[系統] 向量資料庫更新完成。"]);
          setProgress(100);
          setUploadStatus('success');
        }, 2000);
      }, 2000);
    }, 1500);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '2.5rem' }}>平台管理</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem' }}>全域課程與知識圖管理</p>
      </header>

      <div style={{ display: 'grid', gap: '2rem' }}>
        <div className="glass-panel" style={{ borderStyle: 'dashed', borderWidth: '2px', borderColor: 'var(--primary)', textAlign: 'center', padding: '4rem 2rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>上傳官方教科書（PDF／Docx）</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>
            AI 會自動擷取概念、產生自適應題目，並擴充全域精通地圖。
          </p>
          
          <label className="btn-primary" style={{ display: 'inline-block', cursor: 'pointer' }}>
            選擇要匯入的檔案
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
              <span>⚙️</span> RAG 管線狀態
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
                <div key={index} style={{ marginBottom: '0.25rem', color: uploadStatus === 'success' && index === logs.length - 1 ? 'var(--accent)' : 'inherit' }}>
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
