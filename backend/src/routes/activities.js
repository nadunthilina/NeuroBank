const express = require('express');
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');

const router = express.Router();

// Create activity
router.post('/', auth, async (req, res, next) => {
  try {
    const { title, category, startTime, endTime, drainScore, notes } = req.body;
    const activity = await Activity.create({
      user: req.user.id,
      title,
      category,
      startTime,
      endTime,
      drainScore,
      notes,
    });
    res.status(201).json(activity);
  } catch (err) { next(err); }
});

// List activities for user
router.get('/', auth, async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const filter = { user: req.user.id };
    if (from || to) {
      filter.startTime = {};
      if (from) filter.startTime.$gte = new Date(from);
      if (to) filter.startTime.$lte = new Date(to);
    }
    const items = await Activity.find(filter).sort({ startTime: -1 });
    res.json(items);
  } catch (err) { next(err); }
});

// Delete activity
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Activity.findOneAndDelete({ _id: id, user: req.user.id });
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

module.exports = router;
