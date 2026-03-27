import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const DataContext = createContext(null);

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [rawZones, setRawZones] = useState([]);
  const [history, setHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [smoothed, setSmoothed] = useState(false);

  const fetchData = async () => {
    try {
      const [zonesRes, historyRes, alertsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/analyse'),
        axios.get('http://localhost:5000/api/history'),
        axios.get('http://localhost:5000/api/alerts')
      ]);

      setRawZones(zonesRes.data.data);
      setHistory(historyRes.data.data);
      setAlerts(alertsRes.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const zones = React.useMemo(() => {
    if (!smoothed) return rawZones;
    return rawZones.map(z => {
      const getAvg = (arr) => arr && arr.length > 0 ? arr.slice(-5).reduce((a,b)=>a+b,0) / Math.min(5, arr.length) : 0;
      return {
        ...z,
        pH: getAvg(z.history?.pH) || z.pH,
        oil: getAvg(z.history?.oil) || z.oil,
        plastic: getAvg(z.history?.plastic) || z.plastic,
        riskScore: Math.round(getAvg(z.history?.riskScore)) || z.riskScore
      };
    });
  }, [rawZones, smoothed]);

  useEffect(() => {
    fetchData(); // Initial fetch
    
    // Poll every 5 seconds
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <DataContext.Provider value={{ zones, history, alerts, loading, fetchData, smoothed, setSmoothed }}>
      {children}
    </DataContext.Provider>
  );
};
