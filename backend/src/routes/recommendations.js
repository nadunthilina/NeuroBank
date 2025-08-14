const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

const catalog = [
  { id: 'breath-2min', title: '2-minute breathing', tags: ['low_time', 'calm'] },
  { id: 'walk-5', title: '5-minute walk', tags: ['movement'] },
  { id: 'water', title: 'Hydration break', tags: ['basic'] },
  { id: 'stretch', title: 'Stretch routine', tags: ['movement'] },
];

router.get('/', auth, async (req, res) => {
  // naive recommendation: rotate list; later use ML signal and user prefs
  res.json({ items: catalog });
});

module.exports = router;
