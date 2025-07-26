// App.tsx - Simple React site that shows simulation is running
import React, { useState, useEffect } from 'react';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '40px',
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
        maxWidth: '600px',
        width: '100%'
      }}>
        <h1 style={{
          fontSize: '3rem',
          marginBottom: '20px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          🏴󠁧󠁢󠁳󠁣󠁴󠁿 Edinburgh City Simulation
        </h1>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '30px'
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: isLive ? '#4ade80' : '#ef4444',
            marginRight: '10px',
            boxShadow: isLive ? '0 0 10px #4ade80' : '0 0 10px #ef4444',
            animation: isLive ? 'pulse 2s infinite' : 'none'
          }}></div>
          <span style={{ fontSize: '1.2rem' }}>
            {isLive ? 'SIMULATION RUNNING' : 'SIMULATION STOPPED'}
          </span>
        </div>

        <div style={{
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '10px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <h3 style={{ marginBottom: '15px' }}>Current Time</h3>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {currentTime.toLocaleString('en-GB', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '10px',
            padding: '15px'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '5px' }}>☁️</div>
            <div style={{ fontSize: '0.9rem' }}>Weather</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Simulating</div>
          </div>

          <div style={{
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '10px',
            padding: '15px'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '5px' }}>🚗</div>
            <div style={{ fontSize: '0.9rem' }}>Traffic</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Active</div>
          </div>

          <div style={{
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '10px',
            padding: '15px'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '5px' }}>🎭</div>
            <div style={{ fontSize: '0.9rem' }}>Events</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Running</div>
          </div>

          <div style={{
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '10px',
            padding: '15px'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '5px' }}>📊</div>
            <div style={{ fontSize: '0.9rem' }}>Data</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Streaming</div>
          </div>
        </div>

        <div style={{
          fontSize: '0.9rem',
          opacity: 0.8,
          lineHeight: '1.6'
        }}>
          <p>The Edinburgh City Simulation is currently running in Foundry.</p>
          <p>This dashboard will show live data once data streaming is enabled.</p>
        </div>

        <div style={{
          marginTop: '30px',
          fontSize: '0.8rem',
          opacity: 0.6'
        }}>
          Powered by Foundry Compute Module + Vercel
        </div>
      </div>

      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
        `}
      </style>
    </div>
  );
}

export default App;