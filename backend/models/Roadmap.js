const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: String,
  url:   String,
  type:  { type: String, enum: ['documentation', 'course', 'tutorial', 'video', 'book', 'tool'] }
}, { _id: false });

const certSchema = new mongoose.Schema({
  title:    String,
  provider: String,
  url:      String,
  free:     Boolean
}, { _id: false });

const projectSchema = new mongoose.Schema({
  title:       String,
  description: String
}, { _id: false });

const stageSchema = new mongoose.Schema({
  id:             { type: String, required: true },
  title:          { type: String, required: true },
  description:    String,
  order:          Number,
  estimatedHours: Number,
  topics:         [String],
  projects:       [projectSchema],
  resources:      [resourceSchema],
  certifications: [certSchema]
}, { _id: false });

const roadmapSchema = new mongoose.Schema({
  id:          { type: String, required: true, unique: true },
  title:       { type: String, required: true },
  description: String,
  icon:        String,
  color:       String,
  level:       String,
  duration:    String,
  stages:      [stageSchema]
}, { timestamps: true });

module.exports = mongoose.model('Roadmap', roadmapSchema);
