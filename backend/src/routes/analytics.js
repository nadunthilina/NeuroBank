const express = require('express');
const auth = require('../middleware/auth');
const Activity = require('../models/Activity');
const premium = require('../middleware/premium');

const router = express.Router();

router.get('/summary', auth, async (req, res, next) => {
  try {
    const user = req.user.id;
    const items = await Activity.find({ user });
    const total = items.length;
    const avgDrain = total ? items.reduce((a,b)=>a+(b.drainScore||0),0)/total : 0;
    const byCat = {};
    for (const it of items) {
      const c = it.category || 'other';
      byCat[c] = (byCat[c]||0) + (it.drainScore||0);
    }
    const last7 = [];
    const now = new Date();
    for (let i=6;i>=0;i--) {
      const day = new Date(now);
      day.setHours(0,0,0,0);
      day.setDate(day.getDate()-i);
      const next = new Date(day); next.setDate(day.getDate()+1);
      const sum = items.filter(x=> x.startTime>=day && x.startTime<next).reduce((a,b)=>a+(b.drainScore||0),0);
      last7.push({ date: day.toISOString().slice(0,10), drain: sum });
    }
    res.json({ total, avgDrain, byCategory: byCat, last7 });
  } catch (e) { next(e); }
});

router.get('/streak', auth, async (req, res, next) => {
  try {
    const user = req.user.id;
    // Fetch last 60 days to compute streak
    const since = new Date(); since.setDate(since.getDate()-60);
    const items = await Activity.find({ user, startTime: { $gte: since } }).sort({ startTime: -1 });
    const daysWith = new Set(items.map(i => new Date(i.startTime).toISOString().slice(0,10)));
    let streak = 0;
    const today = new Date(); today.setHours(0,0,0,0);
    for (let d = new Date(today); ; d.setDate(d.getDate()-1)) {
      const key = d.toISOString().slice(0,10);
      if (daysWith.has(key)) streak++; else break;
      if (streak>60) break;
    }
    res.json({ streakDays: streak });
  } catch (e) { next(e); }
});

module.exports = router;
router.get('/advanced', auth, premium, async (req, res, next) => {
  try {
    // Placeholder: return 30-day daily drain stats and a simple moving average
    const user = req.user.id;
    const since = new Date(); since.setDate(since.getDate()-30);
    const items = await Activity.find({ user, startTime: { $gte: since } });
    const byDay = new Map();
    for (const it of items) {
      const key = new Date(it.startTime).toISOString().slice(0,10);
      byDay.set(key, (byDay.get(key)||0) + (it.drainScore||0));
    }
    const days = Array.from({length:30}).map((_,i)=>{
      const d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate()-(29-i));
      const key = d.toISOString().slice(0,10);
      return { date: key, drain: byDay.get(key)||0 };
    });
    const sma = days.map((d,i,arr)=>{
      const w = arr.slice(Math.max(0,i-6), i+1);
      const avg = w.reduce((a,b)=>a+b.drain,0)/w.length;
      return { date: d.date, sma7: Number(avg.toFixed(2)) };
    });
    res.json({ days, trend: sma });
  } catch (e) { next(e); }
});
// Advanced analytics (premium)

