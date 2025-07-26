import { useState, useEffect } from 'react';

interface SimulationData {
  record_type: string;
  sim_timestamp: string;
  real_timestamp: string;
  payload: any;
  received_at?: string;
}

interface LatestData {
  weather_data?: SimulationData;
  traffic_zones?: SimulationData;
  events_data?: SimulationData;
  system_status?: SimulationData;
}

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [latestData, setLatestData] = useState<LatestData>({});
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch simulation data every 5 seconds
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/simulation-data');
        const result = await response.json();
        
        if (result.success) {
          setLatestData(result.data);
          setLastUpdate(result.last_updated);
          setIsConnected(true);
        }
      } catch (error) {
        console.error('Error fetching simulation data:', error);
        setIsConnected(false);
      }
    };

    // Initial fetch
    fetchData();

    // Poll every 5 seconds
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatPayload = (payload: any, recordType: string) => {
    if (!payload) return 'No data';
    
    try {
      const data = typeof payload === 'string' ? JSON.parse(payload) : payload;
      
      switch (recordType) {
        case 'weather_data':
          return `${data.weather_description || 'Unknown'} • ${data.temperature_c || 0}°C • ${data.humidity_percent || 0}% humidity`;
        
        case 'traffic_zones':
          const zones = data.datazones ? data.datazones.length : 0;
          return `${zones} zones updated • Traffic simulation active`;
        
        case 'events_data':
          const events = data.active_events_count || 0;
          const attendance = data.total_attendance || 0;
          return `${events} active events • ${attendance.toLocaleString()} total attendance`;
        
        case 'system_status':
          const tick = data.tick_number || 0;
          const running = data.simulation_running ? 'Running' : 'Stopped';
          return `Tick ${tick} • Status: ${running}`;
        
        default:
          return JSON.stringify(data, null, 2);
      }
    } catch (e) {
      return String(payload);
    }
  };

  const getDataAge = (timestamp: string) => {
    if (!timestamp) return '';
    
    const now = new Date();
    const dataTime = new Date(timestamp);
    const diffSeconds = Math.floor((now.getTime() - dataTime.getTime()) / 1000);
    
    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    return `${Math.floor(diffSeconds / 3600)}h ago`;
  };

  const hasRecentData = () => {
    return Object.values(latestData).some(data => {
      if (!data?.received_at) return false;
      const dataTime = new Date(data.received_at);
      const now = new Date();
      return (now.getTime() - dataTime.getTime()) < 300000; // 5 minutes
    });
  };

  const dataStatus = hasRecentData() ? 'Live Data' : isConnected ? 'Connected' : 'Disconnected';

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
        maxWidth: '800px',
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
            backgroundColor: hasRecentData() ? '#4ade80' : isConnected ? '#fbbf24' : '#ef4444',
            marginRight: '10px',
            boxShadow: hasRecentData() ? '0 0 10px #4ade80' : isConnected ? '0 0 10px #fbbf24' : '0 0 10px #ef4444',
            animation: hasRecentData() ? 'pulse 2s infinite' : 'none'
          }}></div>
          <span style={{ fontSize: '1.2rem' }}>
            {dataStatus.toUpperCase()}
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
          {lastUpdate && (
            <div style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '10px' }}>
              Last data: {getDataAge(lastUpdate)}
            </div>
          )}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            background: latestData.weather_data ? 'rgba(40, 167, 69, 0.2)' : 'rgba(0,0,0,0.2)',
            borderRadius: '10px',
            padding: '15px',
            border: latestData.weather_data ? '1px solid rgba(40, 167, 69, 0.3)' : 'none'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '5px' }}>☁️</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Weather</div>
            <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '5px', lineHeight: '1.3' }}>
              {formatPayload(latestData.weather_data?.payload, 'weather_data')}
            </div>
            {latestData.weather_data && (
              <div style={{ fontSize: '0.6rem', opacity: 0.6, marginTop: '5px' }}>
                {getDataAge(latestData.weather_data.received_at || '')}
              </div>
            )}
          </div>

          <div style={{
            background: latestData.traffic_zones ? 'rgba(0, 123, 255, 0.2)' : 'rgba(0,0,0,0.2)',
            borderRadius: '10px',
            padding: '15px',
            border: latestData.traffic_zones ? '1px solid rgba(0, 123, 255, 0.3)' : 'none'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '5px' }}>🚗</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Traffic</div>
            <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '5px', lineHeight: '1.3' }}>
              {formatPayload(latestData.traffic_zones?.payload, 'traffic_zones')}
            </div>
            {latestData.traffic_zones && (
              <div style={{ fontSize: '0.6rem', opacity: 0.6, marginTop: '5px' }}>
                {getDataAge(latestData.traffic_zones.received_at || '')}
              </div>
            )}
          </div>

          <div style={{
            background: latestData.events_data ? 'rgba(255, 193, 7, 0.2)' : 'rgba(0,0,0,0.2)',
            borderRadius: '10px',
            padding: '15px',
            border: latestData.events_data ? '1px solid rgba(255, 193, 7, 0.3)' : 'none'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '5px' }}>🎭</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Events</div>
            <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '5px', lineHeight: '1.3' }}>
              {formatPayload(latestData.events_data?.payload, 'events_data')}
            </div>
            {latestData.events_data && (
              <div style={{ fontSize: '0.6rem', opacity: 0.6, marginTop: '5px' }}>
                {getDataAge(latestData.events_data.received_at || '')}
              </div>
            )}
          </div>

          <div style={{
            background: latestData.system_status ? 'rgba(108, 117, 125, 0.2)' : 'rgba(0,0,0,0.2)',
            borderRadius: '10px',
            padding: '15px',
            border: latestData.system_status ? '1px solid rgba(108, 117, 125, 0.3)' : 'none'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '5px' }}>📊</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>System</div>
            <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '5px', lineHeight: '1.3' }}>
              {formatPayload(latestData.system_status?.payload, 'system_status')}
            </div>
            {latestData.system_status && (
              <div style={{ fontSize: '0.6rem', opacity: 0.6, marginTop: '5px' }}>
                {getDataAge(latestData.system_status.received_at || '')}
              </div>
            )}
          </div>
        </div>

        <div style={{
          fontSize: '0.9rem',
          opacity: 0.8,
          lineHeight: '1.6'
        }}>
          <p>
            {hasRecentData() 
              ? 'Displaying live simulation data from Foundry compute module.'
              : 'Waiting for live simulation data from Foundry compute module.'
            }
          </p>
          <p>Data updates every 15 seconds from the Edinburgh City Simulation.</p>
        </div>

        <div style={{
          marginTop: '30px',
          fontSize: '0.8rem',
          opacity: 0.6
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