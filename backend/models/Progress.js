const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roadmapId:   { type: String, required: true },
  stageId:     { type: String, required: true },
  completedAt: { type: Date, default: Date.now }
}, { timestamps: true });

progressSchema.index({ userId: 1, roadmapId: 1, stageId: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
