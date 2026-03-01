require('dotenv').config();
const mongoose = require('mongoose');
const Roadmap = require('./models/Roadmap');
const roadmapsData = require('./data/roadmaps.json');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB Atlas');

  await Roadmap.deleteMany({});
  await Roadmap.insertMany(roadmapsData);
  console.log(`Seeded ${roadmapsData.length} roadmaps successfully`);

  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
