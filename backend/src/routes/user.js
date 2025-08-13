const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

router.get('/me', auth, async (req, res, next) => {
  try {
    const u = await User.findById(req.user.id).select('-passwordHash');
    res.json(u);
  } catch (e) { next(e); }
});

router.patch('/me', auth, async (req, res, next) => {
  try {
    const { name, circadianType } = req.body;
    const u = await User.findByIdAndUpdate(req.user.id, { name, circadianType }, { new: true }).select('-passwordHash');
    res.json(u);
  } catch (e) { next(e); }
});

module.exports = router;
