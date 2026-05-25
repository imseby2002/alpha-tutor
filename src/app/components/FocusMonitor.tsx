"use client";

import { useState, useEffect } from 'react';

interface FocusMonitorProps {
  onFocusChange: (isFocused: boolean) => void;
}

export default function FocusMonitor({ onFocusChange }: FocusMonitorProps) {
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [mockFocusState, setMockFocusState] = useState(true);

  // In a real application, this would use navigator.mediaDevices.getUserMedia
  // and load a lightweight Edge CV model like face-api.js or MediaPipe
  // to detect head pose and eye tracking locally.
  
  const toggleWebcam = () => {
    setIsWebcamActive(!isWebcamActive);
  };

  // Provide a way to manually test the focus/distracted state logic
  const toggleMockFocus = () => {
    const newState = !mockFocusState;
    setMockFocusState(newState);
    onFocusChange(newState);
  };

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1rem' }}>Edge CV Monitor</h3>
        <span style={{ 
          fontSize: '0.75rem', 
          background: isWebcamActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.1)',
          color: isWebcamActive ? 'var(--accent)' : 'inherit',
          padding: '0.25rem 0.5rem',
          borderRadius: '1rem'
        }}>
          {isWebcamActive ? 'Active (Layer 1)' : 'Inactive'}
        </span>
      </div>
      
      <div style={{ 
        height: '150px', 
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
            <div className="animate-pulse-slow" style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              border: `2px solid ${mockFocusState ? 'var(--accent)' : 'var(--danger)'}`,
              opacity: 0.5,
              borderRadius: '0.5rem'
            }}></div>
            <div style={{ fontSize: '2rem' }}>🧑‍💻</div>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
              Processing frames locally...
            </p>
          </>
        ) : (
          <>
            <div style={{ fontSize: '2rem', opacity: 0.5 }}>📷</div>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
              Webcam off
            </p>
          </>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button onClick={toggleWebcam} className="btn-secondary" style={{ fontSize: '0.875rem', padding: '0.5rem' }}>
          {isWebcamActive ? 'Stop Webcam' : 'Start Webcam Stream'}
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
            Simulate: {mockFocusState ? 'Look Away' : 'Look at Screen'}
          </button>
        )}
      </div>

      <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: '0.5rem' }}>
        * Privacy First: All CV processing runs locally. No video is ever sent to the cloud.
      </p>
    </div>
  );
}
