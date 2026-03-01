const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Progress = require('../models/Progress');
const Roadmap = require('../models/Roadmap');

// GET /api/progress - summary across all roadmaps
router.get('/', auth, async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({}, 'id title icon color duration stages');
    const userProgress = await Progress.find({ userId: req.user.id });

    const summary = roadmaps.map(rm => {
      const completed = userProgress
        .filter(p => p.roadmapId === rm.id)
        .map(p => p.stageId);
      return {
        roadmapId: rm.id,
        title: rm.title,
        icon: rm.icon,
        color: rm.color,
        duration: rm.duration,
        totalStages: rm.stages.length,
        completedStages: completed.length,
        completedIds: completed,
        percentage: Math.round((completed.length / rm.stages.length) * 100)
      };
    });

    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/progress/activity - daily completion counts for the last 365 days
router.get('/activity', auth, async (req, res) => {
  try {
    const since = new Date();
    since.setFullYear(since.getFullYear() - 1);
    const records = await Progress.find({ userId: req.user.id, completedAt: { $gte: since } }, 'completedAt');
    // Group by YYYY-MM-DD
    const counts = {};
    records.forEach(r => {
      const day = r.completedAt.toISOString().slice(0, 10);
      counts[day] = (counts[day] || 0) + 1;
    });
    res.json(counts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/progress/:roadmapId - completed stages for one roadmap
router.get('/:roadmapId', auth, async (req, res) => {
  try {
    const records = await Progress.find({ userId: req.user.id, roadmapId: req.params.roadmapId });
    res.json({ roadmapId: req.params.roadmapId, completedStages: records.map(r => r.stageId) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/progress/:roadmapId/:stageId - mark complete
router.post('/:roadmapId/:stageId', auth, async (req, res) => {
  try {
    const { roadmapId, stageId } = req.params;
    await Progress.findOneAndUpdate(
      { userId: req.user.id, roadmapId, stageId },
      { userId: req.user.id, roadmapId, stageId },
      { upsert: true, new: true }
    );
    const records = await Progress.find({ userId: req.user.id, roadmapId });
    res.json({ roadmapId, completedStages: records.map(r => r.stageId) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/progress/:roadmapId/:stageId - mark incomplete
router.delete('/:roadmapId/:stageId', auth, async (req, res) => {
  try {
    const { roadmapId, stageId } = req.params;
    await Progress.deleteOne({ userId: req.user.id, roadmapId, stageId });
    const records = await Progress.find({ userId: req.user.id, roadmapId });
    res.json({ roadmapId, completedStages: records.map(r => r.stageId) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
