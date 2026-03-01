const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const StageNote = require('../models/StageNote');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
  next();
};

// GET /api/notes/:roadmapId - all notes for one roadmap
router.get('/:roadmapId',
  auth,
  param('roadmapId').trim().notEmpty(),
  validate,
  async (req, res) => {
    try {
      const notes = await StageNote.find({ userId: req.user.id, roadmapId: req.params.roadmapId });
      // Return as { stageId: note } map
      const map = {};
      notes.forEach(n => { map[n.stageId] = n.note; });
      res.json(map);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
);

// PUT /api/notes/:roadmapId/:stageId - save or update a note
router.put('/:roadmapId/:stageId',
  auth,
  param('roadmapId').trim().notEmpty(),
  param('stageId').trim().notEmpty(),
  body('note').isString().isLength({ max: 5000 }).withMessage('Note must be a string up to 5000 characters'),
  validate,
  async (req, res) => {
    try {
      const { roadmapId, stageId } = req.params;
      const { note } = req.body;
      await StageNote.findOneAndUpdate(
        { userId: req.user.id, roadmapId, stageId },
        { userId: req.user.id, roadmapId, stageId, note },
        { upsert: true, new: true }
      );
      res.json({ stageId, note });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
);

module.exports = router;
