const express = require('express');
const router = express.Router();
const Roadmap = require('../models/Roadmap');

// GET /api/roadmaps - all roadmaps (summary, no stages)
router.get('/', async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({}, '-stages -__v');
    const summary = roadmaps.map(r => ({
      id: r.id,
      title: r.title,
      description: r.description,
      icon: r.icon,
      color: r.color,
      level: r.level,
      duration: r.duration
    }));
    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/roadmaps/:id - full roadmap with stages
router.get('/:id', async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({ id: req.params.id }, '-__v');
    if (!roadmap) return res.status(404).json({ message: 'Roadmap not found' });
    res.json(roadmap);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
