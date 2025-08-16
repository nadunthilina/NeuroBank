const express = require('express');
const auth = require('../middleware/auth');
const dayjs = require('dayjs');

// Stub prediction logic — replace with ML microservice call later
async function predictEnergy({ now = new Date() }) {
  // naive circadian curve: high in morning, dip mid-afternoon, rise early evening
  const hour = dayjs(now).hour();
  let base = 0.6;
  if (hour >= 6 && hour < 10) base = 0.85;
  else if (hour >= 10 && hour < 14) base = 0.75;
  else if (hour >= 14 && hour < 17) base = 0.5;
  else if (hour >= 17 && hour < 20) base = 0.65;
  else base = 0.4;
  return Array.from({ length: 12 }).map((_, i) => ({
    t: dayjs(now).add(i * 60, 'minute').toISOString(),
    energy: Math.max(0, Math.min(1, base + (Math.sin(i / 2) * 0.05)))
  }));
}

const router = express.Router();

router.get('/', auth, async (req, res, next) => {
  try {
    const data = await predictEnergy({});
    res.json({ series: data });
  } catch (e) { next(e); }
});

module.exports = router;
