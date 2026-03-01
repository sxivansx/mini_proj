const mongoose = require('mongoose');

const stageNoteSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roadmapId: { type: String, required: true },
  stageId:   { type: String, required: true },
  note:      { type: String, default: '' },
}, { timestamps: true });

stageNoteSchema.index({ userId: 1, roadmapId: 1, stageId: 1 }, { unique: true });

module.exports = mongoose.model('StageNote', stageNoteSchema);
