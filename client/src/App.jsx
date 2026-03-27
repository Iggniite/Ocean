import React from 'react';
import { DataProvider, useData } from './context/DataContext';
import MapComponent from './components/MapComponent';
import DashboardCharts from './components/DashboardCharts';
import MetricCards from './components/MetricCards';
import AlertStream from './components/AlertStream';
import HistoryModal from './components/HistoryModal';
import { Activity, History, ActivitySquare } from 'lucide-react';
import { useState } from 'react';

function Dashboard() {
  const { loading, smoothed, setSmoothed } = useData();
  const [showHistory, setShowHistory] = useState(false);
  
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-primary bg-background">
      <Activity className="animate-spin w-12 h-12" />
      <span className="ml-4 text-xl">Initializing OceanEye...</span>
    </div>
  );

  return (
    <div className="min-h-screen p-6 max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Left Column: Map & Stream */}
      <div className="lg:col-span-2 space-y-6 flex flex-col">
        <header className="glass-panel p-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-safe">
              OceanEye
            </h1>
            <p className="text-gray-400 text-sm mt-1">Real-Time Ocean Health Monitoring and Decision Support</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => setSmoothed(!smoothed)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${smoothed ? 'bg-primary text-background' : 'bg-surfaceBorder text-gray-300'}`}
            >
              <ActivitySquare size={16} /> 
              {smoothed ? 'Smoothed (MA)' : 'Raw Data'}
            </button>
            <button 
              onClick={() => setShowHistory(true)}
              className="px-4 py-2 rounded-full text-sm font-semibold bg-surfaceBorder text-gray-300 flex items-center gap-2 hover:bg-gray-700 transition-colors"
            >
              <History size={16} /> View History
            </button>
            <div className="flex items-center gap-3 bg-surfaceBorder px-4 py-2 rounded-full">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-safe opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-safe"></span>
              </span>
              <span className="text-sm font-medium text-gray-300 tracking-wide uppercase hidden sm:block">Live Sync</span>
            </div>
          </div>
        </header>

        {showHistory && <HistoryModal onClose={() => setShowHistory(false)} />}

        <main className="glass-panel flex-1 min-h-[500px] overflow-hidden p-[2px] relative">
           <MapComponent />
        </main>
        
        <AlertStream />
      </div>

      {/* Right Column: Analytics */}
      <div className="space-y-6 flex flex-col">
        <MetricCards />
        <DashboardCharts />
      </div>

    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <Dashboard />
    </DataProvider>
  );
}
