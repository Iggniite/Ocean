const Zone = require('../models/Zone');

const INITIAL_ZONES = [
  // High Risk / Dangerous
  { name: 'Pacific Garbage Patch Edge', lat: 35.0, lng: -140.0, pH: 7.2, oil: 80.0, plastic: 180.0 },
  { name: 'Gulf of Mexico Spill Zone', lat: 28.0, lng: -90.0, pH: 7.4, oil: 120.0, plastic: 80.0 },
  // Moderate
  { name: 'Mediterranean Sea Traffic', lat: 35.0, lng: 18.0, pH: 7.8, oil: 60.0, plastic: 100.0 },
  { name: 'Indian Ocean Gyre', lat: -20.0, lng: 80.0, pH: 8.0, oil: 40.0, plastic: 150.0 },
  // Safe
  { name: 'Great Barrier Reef', lat: -18.0, lng: 147.0, pH: 8.1, oil: 20.0, plastic: 40.0 },
  { name: 'Arctic Ocean Edge', lat: 75.0, lng: -40.0, pH: 8.2, oil: 20.0, plastic: 40.0 }
];

// Helper to calculate FMEA styled risk score (0-100)
function calculateRisk(pH, oil, plastic) {
  // pH Score (0-1): Ideal range 7.5 - 8.2
  let pHScore = 0;
  if (pH < 7.5) pHScore = (7.5 - pH) / (7.5 - 6.5);
  else if (pH > 8.2) pHScore = (pH - 8.2) / (8.5 - 8.2);
  pHScore = Math.max(0, Math.min(pHScore, 1));

  // Oil Score (0-1): Normalized relative to 200 mg/L bound
  let oilScore = Math.max(0, Math.min(oil / 200, 1));

  // Plastic Score (0-1): Normalized relative to 300 pieces/m^3
  let plasticScore = Math.max(0, Math.min(plastic / 300, 1));

  // Final Risk Weighted
  let risk = (pHScore * 0.3 + oilScore * 0.4 + plasticScore * 0.3) * 100;
  
  // Enforce bounds
  risk = Math.max(0, Math.min(risk, 100));

  return {
    score: Math.round(risk),
    pHRisk: pHScore * 100,
    oilRisk: oilScore * 100,
    plasticRisk: plasticScore * 100
  };
}

// Trend calculation (stable, increasing, decreasing) based on 5-tick moving average
function calculateTrend(historyArr, currentVal) {
  if (!historyArr || historyArr.length < 2) return 'stable';
  const recentAvg = historyArr.slice(-3).reduce((a, b) => a + b, 0) / 3;
  const olderAvg = historyArr.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
  const diff = recentAvg - olderAvg;
  
  if (diff > 2) return 'increasing';
  if (diff < -2) return 'decreasing';
  return 'stable';
}

function deriveInsights(score, riskDetails, pH, oil, plastic) {
  let category = 'Safe';
  if (score > 33) category = 'Moderate';
  if (score > 66) category = 'Dangerous';

  let rootCause = 'Normal Conditions';
  let recommendation = 'Continue standard monitoring.';

  if (category !== 'Safe') {
    // Determine highest contributing factor
    if (riskDetails.oilRisk > riskDetails.pHRisk && riskDetails.oilRisk > riskDetails.plasticRisk) {
      rootCause = 'Oil contamination spike detected.';
      recommendation = 'Deploy oil spill response team and contain area.';
    } else if (riskDetails.plasticRisk > riskDetails.pHRisk) {
      rootCause = 'High microplastic density accumulation.';
      recommendation = 'Initiate waste cleanup protocols and investigate local currents.';
    } else {
      rootCause = pH < 8.0 ? 'Ocean acidification dropping pH levels.' : 'Abnormal alkaline bloom.';
      recommendation = 'Increase local water sampling to identify chemical runoff.';
    }
  }

  return { category, rootCause, recommendation };
}

class SimulationEngine {
  async start() {
    console.log('Initializing Data Simulation Engine...');
    
    // Seed DB clean to ensure calibration applies
    await Zone.deleteMany({});
    for (let z of INITIAL_ZONES) {
      const zone = new Zone({
        ...z,
        history: { pH: [z.pH], oil: [z.oil], plastic: [z.plastic], riskScore: [calculateRisk(z.pH, z.oil, z.plastic).score] }
      });
      const riskData = calculateRisk(z.pH, z.oil, z.plastic);
      const insights = deriveInsights(
        zone.history.riskScore[0], 
        riskData, 
        z.pH, z.oil, z.plastic
      );
      zone.category = insights.category;
      zone.rootCause = insights.rootCause;
      zone.recommendation = insights.recommendation;
      zone.riskScore = zone.history.riskScore[0];
      zone.pHRisk = riskData.pHRisk;
      zone.oilRisk = riskData.oilRisk;
      zone.plasticRisk = riskData.plasticRisk;
      await zone.save();
    }
    console.log('Seeded 6 Initial Zones with Calibrated Baselines.');

    // Refresh data every 5 seconds
    setInterval(async () => {
      const zones = await Zone.find();
      for (let zone of zones) {
        
        const baseZone = INITIAL_ZONES.find(z => z.name === zone.name) || INITIAL_ZONES[0];
        
        let newPH = baseZone.pH + (Math.random() * 0.4 - 0.2);
        let newOil = baseZone.oil + (Math.random() * 40 - 20);
        let newPlastic = baseZone.plastic + (Math.random() * 60 - 30);

        // rare spike (10%)
        if (Math.random() < 0.1) {
          newOil = baseZone.oil + 80 + Math.random() * 60;
          newPlastic = baseZone.plastic + 100 + Math.random() * 60;
          newPH = baseZone.pH - 0.4 - Math.random() * 0.4;
        }

        // clamp values strictly to limits
        newPH = Math.max(6.5, Math.min(8.5, newPH));
        newOil = Math.max(0, Math.min(200, newOil));
        newPlastic = Math.max(0, Math.min(300, newPlastic));

        // Risk & Insights
        const riskData = calculateRisk(newPH, newOil, newPlastic);
        const insights = deriveInsights(riskData.score, riskData, newPH, newOil, newPlastic);

        // Update arrays (max 10 points for MA)
        zone.history.pH.push(newPH);
        zone.history.oil.push(newOil);
        zone.history.plastic.push(newPlastic);
        zone.history.riskScore.push(riskData.score);

        if (zone.history.pH.length > 10) {
          zone.history.pH.shift();
          zone.history.oil.shift();
          zone.history.plastic.shift();
          zone.history.riskScore.shift();
        }

        const trend = calculateTrend(zone.history.riskScore, riskData.score);

        // Save
        zone.pH = newPH;
        zone.oil = newOil;
        zone.plastic = newPlastic;
        zone.riskScore = riskData.score;
        zone.pHRisk = riskData.pHRisk;
        zone.oilRisk = riskData.oilRisk;
        zone.plasticRisk = riskData.plasticRisk;
        zone.category = insights.category;
        zone.rootCause = insights.rootCause;
        zone.recommendation = insights.recommendation;
        zone.trend = trend;
        zone.lastUpdated = new Date();

        await zone.save();
      }
    }, 5000);
  }
}

module.exports = new SimulationEngine();
