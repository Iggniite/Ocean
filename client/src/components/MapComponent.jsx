import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useData } from '../context/DataContext';

// Fix leafet default icon issue
import 'leaflet/dist/leaflet.css';

// Custom icons based on risk category
const createIcon = (color) => {
  return new L.DivIcon({
    className: 'custom-icon',
    html: `<div style="width: 24px; height: 24px; background-color: ${color}; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px ${color}"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

const icons = {
  Safe: createIcon('#10b981'), // safe (green)
  Moderate: createIcon('#f59e0b'), // moderate (yellow)
  Dangerous: createIcon('#ef4444') // dangerous (red)
};

export default function MapComponent() {
  const { zones } = useData();

  if (!zones || zones.length === 0) return null;

  return (
    <div className="h-full w-full rounded-[14px] overflow-hidden relative z-0">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%', background: '#0a0f1a' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        {zones.map((zone) => (
          <Marker 
            key={zone._id} 
            position={[zone.lat, zone.lng]} 
            icon={icons[zone.category] || icons.Safe}
          >
            <Popup className="custom-popup">
              <div className="p-1 min-w-[220px]">
                <h3 className="font-bold text-lg mb-2 text-gray-800">{zone.name}</h3>
                
                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                  <div className="bg-gray-100 p-2 rounded">
                    <p className="text-gray-500 text-xs">pH Level</p>
                    <p className="font-semibold text-gray-800">{zone.pH.toFixed(2)}</p>
                  </div>
                  <div className="bg-gray-100 p-2 rounded">
                    <p className="text-gray-500 text-xs">Oil (mg/L)</p>
                    <p className="font-semibold text-gray-800">{zone.oil.toFixed(2)}</p>
                  </div>
                  <div className="bg-gray-100 p-2 rounded">
                    <p className="text-gray-500 text-xs">Plastic</p>
                    <p className="font-semibold text-gray-800">{zone.plastic.toFixed(2)}</p>
                  </div>
                  <div className={`p-2 rounded text-white ${
                    zone.category === 'Safe' ? 'bg-emerald-500' : 
                    zone.category === 'Moderate' ? 'bg-amber-500' : 'bg-red-500'
                  }`}>
                    <p className="text-white/80 text-xs text-center">Risk Score</p>
                    <p className="font-bold text-center text-lg">{zone.riskScore}</p>
                  </div>
                </div>

                {(() => {
                  const totalBase = (zone.pHRisk * 0.3) + (zone.oilRisk * 0.4) + (zone.plasticRisk * 0.3);
                  const phPct = totalBase > 0 ? Math.round(((zone.pHRisk * 0.3) / totalBase) * 100) : 0;
                  const oilPct = totalBase > 0 ? Math.round(((zone.oilRisk * 0.4) / totalBase) * 100) : 0;
                  const plasticPct = totalBase > 0 ? Math.round(((zone.plasticRisk * 0.3) / totalBase) * 100) : 0;
                  return (
                    <div className="mb-3">
                      <p className="text-gray-500 text-[11px] uppercase tracking-wider font-bold mb-1">Risk Contribution</p>
                      <div className="grid grid-cols-3 gap-1 text-center">
                        <div className="bg-purple-100 p-1 rounded"><p className="text-[10px] text-purple-600 font-bold uppercase">pH</p><p className="font-bold text-purple-800 text-xs">{phPct}%</p></div>
                        <div className="bg-amber-100 p-1 rounded"><p className="text-[10px] text-amber-600 font-bold uppercase">Oil</p><p className="font-bold text-amber-800 text-xs">{oilPct}%</p></div>
                        <div className="bg-blue-100 p-1 rounded"><p className="text-[10px] text-blue-600 font-bold uppercase">Plastic</p><p className="font-bold text-blue-800 text-xs">{plasticPct}%</p></div>
                      </div>
                    </div>
                  );
                })()}

                <div className="border-t pt-2 text-sm">
                  <p><strong>Trend:</strong> <span className="capitalize">{zone.trend}</span></p>
                  <p className="text-red-600 mt-1"><strong>Root Cause:</strong> {zone.rootCause}</p>
                  <p className="text-emerald-700 mt-1"><strong>Action:</strong> {zone.recommendation}</p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
