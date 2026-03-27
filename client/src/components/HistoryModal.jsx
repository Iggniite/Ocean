import React from 'react';
import { useData } from '../context/DataContext';
import { X, Download } from 'lucide-react';

export default function HistoryModal({ onClose }) {
  const { zones } = useData();

  // Helper to format data to CSV
  const downloadCSV = () => {
    if (!zones || zones.length === 0) return;
    
    const headers = ['Zone', 'Last Updated', 'Trend', 'Category', 'pH Risk(%)', 'Oil Risk(%)', 'Plastic Risk(%)', 'Risk Score'];
    const rows = zones.map(z => {
      const totalBase = (z.pHRisk * 0.3) + (z.oilRisk * 0.4) + (z.plasticRisk * 0.3) || 1;
      const phPct = Math.round(((z.pHRisk * 0.3) / totalBase) * 100);
      const oilPct = Math.round(((z.oilRisk * 0.4) / totalBase) * 100);
      const plPct = Math.round(((z.plasticRisk * 0.3) / totalBase) * 100);

      const d = new Date(z.lastUpdated).toLocaleString();
      return `"${z.name}","${d}","${z.trend}","${z.category}",${phPct},${oilPct},${plPct},${z.riskScore}`;
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "oceaneye_history_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-surface border border-surfaceBorder rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col max-h-[85vh]">
        <div className="p-6 border-b border-surfaceBorder flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Advanced Historical Data View</h2>
            <p className="text-sm text-gray-400 mt-1">Cross-sectional analysis of all simulated zones.</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={downloadCSV}
              className="bg-primary/20 text-primary hover:bg-primary/30 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all"
            >
              <Download size={18} /> Export CSV
            </button>
            <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-300">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-black/20 text-gray-400">
              <tr>
                <th className="px-4 py-3 rounded-tl border-b border-surfaceBorder">Zone Name</th>
                <th className="px-4 py-3 border-b border-surfaceBorder">Risk Level</th>
                <th className="px-4 py-3 border-b border-surfaceBorder capitalize text-center">Trend</th>
                <th className="px-4 py-3 border-b border-surfaceBorder text-center">pH Risk Contrib.</th>
                <th className="px-4 py-3 border-b border-surfaceBorder text-center">Oil Risk Contrib.</th>
                <th className="px-4 py-3 border-b border-surfaceBorder text-center">Plastic Risk Contrib.</th>
                <th className="px-4 py-3 rounded-tr border-b border-surfaceBorder text-right">Agg. Score</th>
              </tr>
            </thead>
            <tbody>
              {zones.map((z, i) => {
                const totalBase = (z.pHRisk * 0.3) + (z.oilRisk * 0.4) + (z.plasticRisk * 0.3) || 1;
                const phPct = Math.round(((z.pHRisk * 0.3) / totalBase) * 100);
                const oilPct = Math.round(((z.oilRisk * 0.4) / totalBase) * 100);
                const plPct = Math.round(((z.plasticRisk * 0.3) / totalBase) * 100);

                return (
                  <tr key={i} className="border-b border-surfaceBorder hover:bg-white/5 transition-colors">
                    <td className="px-4 py-4 font-semibold text-white">{z.name}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        z.category === 'Safe' ? 'bg-safe/20 text-safe' : 
                        z.category === 'Moderate' ? 'bg-moderate/20 text-moderate' : 'bg-dangerous/20 text-dangerous'
                      }`}>{z.category}</span>
                    </td>
                    <td className="px-4 py-4 text-center capitalize">{z.trend}</td>
                    <td className="px-4 py-4 text-center text-purple-300">{phPct}%</td>
                    <td className="px-4 py-4 text-center text-amber-300">{oilPct}%</td>
                    <td className="px-4 py-4 text-center text-blue-300">{plPct}%</td>
                    <td className="px-4 py-4 font-bold text-right text-white text-lg">{z.riskScore}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
