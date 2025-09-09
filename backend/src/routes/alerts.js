const express = require('express');
const auth = require('../middleware/auth');
const Activity = require('../models/Activity');

const router = express.Router();

// Simple overdraft: if sum of last 3 activities drain >= 20, warn
router.get('/overdraft', auth, async (req, res, next) => {
  try {
    const recent = await Activity.find({ user: req.user.id }).sort({ startTime: -1 }).limit(3);
    const sum = recent.reduce((a, b) => a + (b.drainScore || 0), 0);
    const risk = sum >= 20 ? 'high' : sum >= 12 ? 'medium' : 'low';
    res.json({ risk, recent: recent.map(r => ({ id: r._id, title: r.title, drain: r.drainScore })) });
  } catch (e) { next(e); }
});

module.exports = router;
