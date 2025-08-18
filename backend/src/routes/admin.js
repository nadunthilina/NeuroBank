const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const User = require('../models/User');
const Activity = require('../models/Activity');

const router = express.Router();

router.get('/stats', auth, admin, async (req, res, next) => {
  try {
    const [users, activities, disabled] = await Promise.all([
      User.estimatedDocumentCount(),
      Activity.estimatedDocumentCount(),
      User.countDocuments({ status: 'disabled' }),
    ]);
    res.json({ users, activities, disabled });
  } catch (e) { next(e); }
});

router.get('/users', auth, admin, async (req, res, next) => {
  try {
    const list = await User.find().select('-passwordHash').limit(100);
    res.json({ users: list });
  } catch (e) { next(e); }
});

router.patch('/users/:id/status', auth, admin, async (req, res, next) => {
  try {
    const { status } = req.body; // 'active' | 'disabled'
    if (!['active','disabled'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
    const u = await User.findByIdAndUpdate(req.params.id, { status }, { new: true }).select('-passwordHash');
    if (!u) return res.status(404).json({ error: 'Not found' });
    res.json(u);
  } catch (e) { next(e); }
});

router.get('/health', auth, admin, async (req, res) => {
  res.json({ uptime: process.uptime(), ts: Date.now(), db: !!Activity.db.readyState });
});

router.patch('/users/:id/role', auth, admin, async (req, res, next) => {
  try {
    const { role } = req.body; // 'user' | 'premium' | 'admin'
    if (!['user','premium','admin'].includes(role)) return res.status(400).json({ error: 'Invalid role' });
    const u = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-passwordHash');
    if (!u) return res.status(404).json({ error: 'Not found' });
    res.json(u);
  } catch (e) { next(e); }
});

module.exports = router;
