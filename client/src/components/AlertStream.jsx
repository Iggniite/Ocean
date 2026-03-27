import React from 'react';
import { useData } from '../context/DataContext';
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function AlertStream() {
  const { alerts, zones } = useData();

  return (
    <div className="glass-panel p-5 overflow-y-auto max-h-[300px]">
      <h3 className="text-lg font-semibold text-white mb-4 sticky top-0 bg-surface/80 backdrop-blur pb-2 z-10 
                     border-b border-surfaceBorder">
        Live Alert Stream & Action Insights
      </h3>
      
      <div className="flex flex-col gap-3">
        {alerts.length === 0 ? (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-safe/10 border border-safe/20 text-safe">
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            <p>All monitored zones are currently stable. No critical alerts detected.</p>
          </div>
        ) : (
          alerts.map(alert => (
            <div 
              key={alert._id} 
              className={`flex gap-4 p-4 rounded-xl border relative overflow-hidden transition-all
              ${alert.category === 'Dangerous' 
                ? 'bg-dangerous/10 border-dangerous/30' 
                : 'bg-moderate/10 border-moderate/30'}`}
            >
              {/* Left Accent line */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 
                 ${alert.category === 'Dangerous' ? 'bg-dangerous' : 'bg-moderate'}
              `}></div>

              <div className="flex-shrink-0 mt-1">
                {alert.category === 'Dangerous' ? (
                   <AlertCircle className="w-6 h-6 text-dangerous" />
                ) : (
                   <AlertTriangle className="w-6 h-6 text-moderate" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-white">{alert.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded font-bold uppercase tracking-wider
                         ${alert.category === 'Dangerous' ? 'bg-dangerous text-white' : 'bg-moderate text-white'}
                  `}>
                    {alert.category}
                  </span>
                </div>
                
                <p className="text-sm text-gray-300 mb-2 font-medium">
                  Risk Score: {alert.riskScore} <span className="text-gray-500 mx-2">|</span> 
                  Trend: <span className="capitalize">{alert.trend}</span>
                </p>

                {(() => {
                  const totalBase = (alert.pHRisk * 0.3) + (alert.oilRisk * 0.4) + (alert.plasticRisk * 0.3);
                  const phPct = totalBase > 0 ? Math.round(((alert.pHRisk * 0.3) / totalBase) * 100) : 0;
                  const oilPct = totalBase > 0 ? Math.round(((alert.oilRisk * 0.4) / totalBase) * 100) : 0;
                  const plasticPct = totalBase > 0 ? Math.round(((alert.plasticRisk * 0.3) / totalBase) * 100) : 0;
                  return (
                    <div className="flex gap-2 text-[11px] font-bold mt-2 text-gray-300 mb-3 uppercase tracking-wider">
                      <span className="bg-black/30 px-2 py-1 rounded text-purple-300">pH: {phPct}%</span>
                      <span className="bg-black/30 px-2 py-1 rounded text-amber-400">Oil: {oilPct}%</span>
                      <span className="bg-black/30 px-2 py-1 rounded text-blue-300">Plastic: {plasticPct}%</span>
                    </div>
                  );
                })()}

                <div className="space-y-1">
                  <p className="text-sm bg-black/20 p-2 rounded text-red-300">
                    <span className="font-bold">Root Cause:</span> {alert.rootCause}
                  </p>
                  <p className="text-sm bg-black/20 p-2 rounded text-emerald-300">
                    <span className="font-bold">Recommendation:</span> {alert.recommendation}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
