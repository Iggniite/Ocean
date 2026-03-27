import React from 'react';
import { useData } from '../context/DataContext';
import { ShieldAlert, Droplets, FlaskConical, Wind } from 'lucide-react';

export default function MetricCards() {
  const { zones } = useData();

  if (!zones || zones.length === 0) return null;

  // Aggregate Metrics
  const avgPh = (zones.reduce((acc, z) => acc + z.pH, 0) / zones.length).toFixed(2);
  const avgOil = (zones.reduce((acc, z) => acc + z.oil, 0) / zones.length).toFixed(1);
  const avgPlastic = (zones.reduce((acc, z) => acc + z.plastic, 0) / zones.length).toFixed(0);
  const highRiskCount = zones.filter(z => z.category === 'Dangerous').length;

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* High Risk Critical */}
      <div className="glass-panel p-4 flex items-center justify-between border-l-4 border-l-dangerous">
        <div>
          <p className="text-gray-400 text-sm font-medium">Critical Zones</p>
          <p className="text-3xl font-bold text-white mt-1">{highRiskCount}</p>
        </div>
        <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
          <ShieldAlert size={28} />
        </div>
      </div>

      {/* Avg pH */}
      <div className="glass-panel p-4 flex items-center justify-between border-l-4 border-l-primary">
        <div>
          <p className="text-gray-400 text-sm font-medium">Global Avg pH</p>
          <p className="text-3xl font-bold text-white mt-1">{avgPh}</p>
        </div>
        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
          <FlaskConical size={28} />
        </div>
      </div>

      {/* Contamination (Oil) */}
      <div className="glass-panel p-4 flex items-center justify-between border-l-4 border-l-moderate">
        <div>
          <p className="text-gray-400 text-sm font-medium">Avg Oil Level (mg/L)</p>
          <p className="text-3xl font-bold text-white mt-1">{avgOil}</p>
        </div>
        <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
          <Droplets size={28} />
        </div>
      </div>

      {/* Plastic density */}
      <div className="glass-panel p-4 flex items-center justify-between border-l-4 border-l-safe">
        <div>
          <p className="text-gray-400 text-sm font-medium">Avg Plastic Debris</p>
          <p className="text-3xl font-bold text-white mt-1">{avgPlastic}</p>
        </div>
        <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
          <Wind size={28} />
        </div>
      </div>
    </div>
  );
}
