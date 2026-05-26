"use client";

import Link from 'next/link';

export default function ParentPortal() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2rem' }}>家長專區</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem' }}>每日學習摘要與洞察</p>
        </div>
        <Link href="/" className="btn-secondary">切換至學生端</Link>
      </header>

      <div className="glass-panel hover-scale" style={{ marginBottom: '2rem', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid var(--primary)' }}>
        <h2 style={{ color: 'var(--primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>✨</span> 小愛的 AI 每日報告
        </h2>
        <p style={{ lineHeight: '1.8', color: 'rgba(255,255,255,0.9)' }}>
          小愛今天學習效率很高！她以 <strong>92% 正確率</strong> 快速掌握了 <strong>二次方程式</strong>。
          專注監測顯示 <strong>88% 專注度</strong>。
          <br /><br />
          <strong>AI 建議：</strong> 在拋物線應用題（軌跡問題）上稍有卡關，明天會安排 2 題短複習。
          請鼓勵她今天獲得了 150 XP！
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'rgba(255,255,255,0.7)' }}>今日學習時間</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700 }}>45 <span style={{ fontSize: '1rem', fontWeight: 400, color: 'rgba(255,255,255,0.5)' }}>分鐘</span></p>
          <div style={{ marginTop: '0.5rem', background: 'var(--surface)', borderRadius: '999px', height: '6px' }}>
            <div style={{ width: '100%', height: '100%', background: 'var(--accent)', borderRadius: '999px' }}></div>
          </div>
          <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--accent)' }}>比每日目標提早 15 分鐘完成！</p>
        </div>

        <div className="glass-panel">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'rgba(255,255,255,0.7)' }}>精通進度</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700 }}>等級 5</p>
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
        <h3 style={{ marginBottom: '1.5rem' }}>弱點雷達（Layer 3 AI 分析）</h3>
        <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
          {[
            { topic: '代數', score: 95 },
            { topic: '幾何', score: 80 },
            { topic: '應用題', score: 65, alert: true }
          ].map((item, i) => (
             <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ width: '80px', flexShrink: 0, color: item.alert ? 'var(--warning)' : 'inherit' }}>{item.topic}</span>
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
