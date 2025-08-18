const express = require('express');
const Plan = require('../models/Plan');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res, next) => {
  try {
    const plans = await Plan.find({ user: req.user.id }).sort({ targetDate: 1 });
    res.json(plans);
  } catch (e) { next(e); }
});

router.post('/', auth, async (req, res, next) => {
  try {
    const { title, targetDate, priority, expectedDrain, notes } = req.body;
    const plan = await Plan.create({ user: req.user.id, title, targetDate, priority, expectedDrain, notes });
    res.status(201).json(plan);
  } catch (e) { next(e); }
});

router.delete('/:id', auth, async (req, res, next) => {
  try {
    const del = await Plan.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!del) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

module.exports = router;
