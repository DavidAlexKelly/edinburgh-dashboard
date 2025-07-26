// api/simulation-data.js - Vercel API endpoint to receive simulation data

// In-memory storage for the latest data (resets on each deployment)
let latestSimulationData = {
  weather_data: null,
  traffic_zones: null, 
  events_data: null,
  system_status: null
};

export default function handler(req, res) {
  // Enable CORS for cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      // Receive data from Foundry compute module
      const data = req.body;
      
      console.log(`Received ${data.record_type} data from Edinburgh simulation`);
      
      // Store the latest data by record type
      latestSimulationData[data.record_type] = {
        ...data,
        received_at: new Date().toISOString()
      };
      
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
      // Serve the latest simulation data to the frontend
      res.status(200).json({
        success: true,
        data: latestSimulationData,
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