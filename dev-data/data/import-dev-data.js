const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const Tour = require('./../../models/tourModels');

// Connect to MongoDB
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then((con) => console.log('Connected to MongoDB...'));

// Read JSON file and parsing it
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf8'));

// IMPORT DATA INTO DATABASE
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully uploaded to MongoDB...');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE DATA FROM Collection
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted from Database...');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
console.log(process.argv);
