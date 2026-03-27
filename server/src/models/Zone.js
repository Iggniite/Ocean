const mongoose = require('mongoose');

const ZoneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  
  // Current values
  pH: { type: Number, required: true },
  oil: { type: Number, required: true }, // mg/L or ppm
  plastic: { type: Number, required: true }, // pieces per m^3
  
  // Calculated Risk metrics
  riskScore: { type: Number, default: 0 },
  category: { type: String, default: 'Safe' }, // Safe, Moderate, Dangerous
  trend: { type: String, default: 'stable' }, // increasing, stable, decreasing
  rootCause: { type: String, default: 'None' },
  recommendation: { type: String, default: 'Continue standard monitoring.' },
  
  // Individual risk components for breakdown
  pHRisk: { type: Number, default: 0 },
  oilRisk: { type: Number, default: 0 },
  plasticRisk: { type: Number, default: 0 },
  
  // History for Moving Average (keep last 5 readings for each parameter)
  history: {
    pH: [Number],
    oil: [Number],
    plastic: [Number],
    riskScore: [Number]
  },
  
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Zone', ZoneSchema);
