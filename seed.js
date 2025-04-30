// seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const State = require('./models/State');

const DATABASE_URI = process.env.DATABASE_URI;

const seedStates = [
  { stateCode: 'KS', funfacts: ['Known for wheat.', 'Wizard of Oz.', 'Geographic center of U.S.'] },
  { stateCode: 'NE', funfacts: ['Birthplace of Kool-Aid.', 'Home to Chimney Rock.', 'Big aquifer.'] },
  { stateCode: 'OK', funfacts: ['First tornado warning.', 'Many man-made lakes.', 'Oil under capitol building.'] },
  { stateCode: 'MO', funfacts: ['Gateway Arch.', 'Mark Twain.', 'More fountains than Rome.'] },
  { stateCode: 'CO', funfacts: ['Mile-high city.', 'Highest paved road.', 'Rocky Mountains.'] }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ Connected to MongoDB');

    for (const state of seedStates) {
      await State.findOneAndUpdate(
        { stateCode: state.stateCode },
        { $set: { funfacts: state.funfacts } },
        { upsert: true, new: true }
      );
      console.log(`🔁 Seeded: ${state.stateCode}`);
    }

    console.log('🌱 Seeding complete.');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDatabase();
