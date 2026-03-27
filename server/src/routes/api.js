const express = require('express');
const router = express.Router();
const Zone = require('../models/Zone');

// GET /api/analyse -> Get all zones' latest data and risk score
router.get('/analyse', async (req, res) => {
  try {
    const zones = await Zone.find({}); 
    res.json({ success: true, count: zones.length, data: zones });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/history -> Get history of all zones
router.get('/history', async (req, res) => {
  try {
    const zones = await Zone.find({});
    // Return just name, location, and history
    const historyData = zones.map(z => ({
      _id: z._id,
      name: z.name,
      lat: z.lat,
      lng: z.lng,
      history: z.history,
      trend: z.trend
    }));
    res.json({ success: true, data: historyData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/alerts -> Return currently Dangerous or Moderate zones as alerts
router.get('/alerts', async (req, res) => {
  try {
    const alerts = await Zone.find({ category: { $in: ['Dangerous', 'Moderate'] } }, { history: 0 })
                             .sort({ riskScore: -1 });
    res.json({ success: true, count: alerts.length, data: alerts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/report/:id -> Detailed zone report
router.get('/report/:id', async (req, res) => {
  try {
    const zone = await Zone.findById(req.params.id);
    if (!zone) return res.status(404).json({ success: false, message: 'Zone not found' });
    res.json({ success: true, data: zone });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
