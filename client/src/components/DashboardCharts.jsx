import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useData } from '../context/DataContext';

const COLORS = {
  Safe: '#10b981',
  Moderate: '#f59e0b',
  Dangerous: '#ef4444'
};

export default function DashboardCharts() {
  const { zones, history } = useData();

  // Prepare Pie Chart Data
  const distribution = useMemo(() => {
    if (!zones.length) return [];
    const counts = { Safe: 0, Moderate: 0, Dangerous: 0 };
    zones.forEach(z => { counts[z.category] = (counts[z.category] || 0) + 1; });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] })).filter(d => d.value > 0);
  }, [zones]);

  // Use the most severe zone for history chart, or just the first one if all are safe
  const chartZone = useMemo(() => {
    if (!history.length) return null;
    let worst = history.reduce((prev, curr) => {
      const pMax = Math.max(...prev.history.riskScore);
      const cMax = Math.max(...curr.history.riskScore);
      return (pMax > cMax) ? prev : curr;
    }, history[0]);
    return worst;
  }, [history]);

  const historyData = useMemo(() => {
    if (!chartZone) return [];
    return chartZone.history.riskScore.map((score, i) => ({
      time: `T-${10 - i}`, // relative time
      score: Math.round(score),
      pH: chartZone.history.pH[i],
      oil: chartZone.history.oil[i],
      plastic: chartZone.history.plastic[i]
    }));
  }, [chartZone]);

  return (
    <div className="flex flex-col gap-6 flex-1 h-full">
      
      {/* Risk Distribution */}
      <div className="glass-panel p-5 flex-1 relative">
        <h3 className="text-lg font-semibold mb-4 text-white">Global Zone Distribution</h3>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {distribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(20, 30, 48, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend Custom */}
        <div className="flex justify-center gap-4 mt-2">
          {distribution.map((d) => (
            <div key={d.name} className="flex items-center gap-2 text-sm text-gray-300">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[d.name] }}></span>
              {d.name} ({d.value})
            </div>
          ))}
        </div>
      </div>

      {/* History Area Chart */}
      <div className="glass-panel p-5 flex-1">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Risk Trend</h3>
          {chartZone && (
            <span className="text-xs bg-surfaceBorder px-3 py-1 rounded-full text-primary">Target: {chartZone.name}</span>
          )}
        </div>
        
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis dataKey="time" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(20, 30, 48, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#0ea5e9', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="score" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
