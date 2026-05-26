"use client";

import { useState, useEffect, useRef } from 'react';

interface FocusMonitorProps {
  onFocusChange: (isFocused: boolean) => void;
}

export default function FocusMonitor({ onFocusChange }: FocusMonitorProps) {
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [mockFocusState, setMockFocusState] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const toggleWebcam = async () => {
    if (isWebcamActive) {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setStream(null);
      setIsWebcamActive(false);
    } else {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
        setIsWebcamActive(true);
      } catch (err) {
        console.error("Error accessing webcam", err);
        alert("無法存取攝影機，請檢查瀏覽器權限設定。");
      }
    }
  };

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const toggleMockFocus = () => {
    const newState = !mockFocusState;
    setMockFocusState(newState);
    onFocusChange(newState);
  };

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1rem' }}>邊緣視覺監測</h3>
        <span style={{ 
          fontSize: '0.75rem', 
          background: isWebcamActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.1)',
          color: isWebcamActive ? 'var(--accent)' : 'inherit',
          padding: '0.25rem 0.5rem',
          borderRadius: '1rem'
        }}>
          {isWebcamActive ? 'Layer 1 運作中' : '未啟動'}
        </span>
      </div>
      
      <div style={{ 
        height: '180px', 
        background: 'var(--surface)', 
        borderRadius: '0.5rem',
        border: '1px solid var(--glass-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '0.5rem',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {isWebcamActive ? (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div className="animate-pulse-slow" style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              border: `3px solid ${mockFocusState ? 'var(--accent)' : 'var(--danger)'}`,
              borderRadius: '0.5rem',
              pointerEvents: 'none'
            }}></div>
            <div style={{ 
              position: 'absolute', 
              bottom: '10px', 
              background: 'rgba(0,0,0,0.7)', 
              padding: '0.25rem 0.75rem', 
              borderRadius: '1rem',
              fontSize: '0.75rem'
            }}>
              追蹤視線與在座狀態…
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: '2rem', opacity: 0.5 }}>📷</div>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
              攝影機已關閉
            </p>
          </>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button onClick={toggleWebcam} className="btn-primary" style={{ fontSize: '0.875rem', padding: '0.5rem' }}>
          {isWebcamActive ? '關閉攝影機' : '啟動邊緣視覺'}
        </button>
        
        {isWebcamActive && (
          <button 
            onClick={toggleMockFocus} 
            className="btn-secondary" 
            style={{ 
              fontSize: '0.875rem', 
              padding: '0.5rem',
              borderColor: mockFocusState ? 'var(--danger)' : 'var(--accent)',
              color: mockFocusState ? 'var(--danger)' : 'var(--accent)'
            }}
          >
            模擬：{mockFocusState ? '看向別處／分心' : '注視螢幕'}
          </button>
        )}
      </div>

      <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: '0.5rem' }}>
        * 隱私優先：人臉偵測在瀏覽器本機執行，影片絕不會上傳至雲端。
      </p>
    </div>
  );
}
