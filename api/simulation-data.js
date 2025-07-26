// api/simulation-data.js - Vercel API endpoint to receive simulation data

// In-memory storage for the latest data (resets on each deployment)
let latestSimulationData = {
  weather_data: null,
  traffic_zones: null, 
  events_data: null,
  system_status: null
};

// Store connection statistics
let connectionStats = {
  total_requests: 0,
  successful_posts: 0,
  last_foundry_connection: null,
  startup_time: new Date().toISOString()
};

export default function handler(req, res) {
  connectionStats.total_requests++;
  
  // Enable CORS for cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      // Receive data from Foundry compute module
      const data = req.body;
      
      // Validate required fields
      if (!data.record_type || !data.payload) {
        console.error('Invalid data received - missing record_type or payload');
        res.status(400).json({ 
          error: 'Missing required fields: record_type and payload are required' 
        });
        return;
      }
      
      console.log(`✅ Received ${data.record_type} data from Edinburgh simulation`);
      
      // Store the latest data by record type
      latestSimulationData[data.record_type] = {
        ...data,
        received_at: new Date().toISOString()
      };
      
      // Update connection stats
      connectionStats.successful_posts++;
      connectionStats.last_foundry_connection = new Date().toISOString();
      
      res.status(200).json({ 
        success: true, 
        message: `${data.record_type} data received`,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Error processing simulation data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } 
  else if (req.method === 'GET') {
    try {
      // Calculate data freshness
      const now = new Date();
      const dataTypes = Object.keys(latestSimulationData);
      const freshData = {};
      
      dataTypes.forEach(type => {
        if (latestSimulationData[type]?.received_at) {
          const dataTime = new Date(latestSimulationData[type].received_at);
          const ageMinutes = (now - dataTime) / (1000 * 60);
          freshData[type] = ageMinutes < 5; // Consider data fresh if less than 5 minutes old
        } else {
          freshData[type] = false;
        }
      });
      
      // Serve the latest simulation data to the frontend
      res.status(200).json({
        success: true,
        data: latestSimulationData,
        connection_stats: connectionStats,
        data_freshness: freshData,
        last_updated: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Error serving simulation data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } 
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}