const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

// Connect to MongoDB
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then((con) => console.log('Connected to MongoDB...'));

//MODELS
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A name must be provided'],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, 'A price must be provided'],
  },
  rating: { type: Number, default: 4.5 },
});

const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'The Park camper',
  price: 497,
  rating: 4.9,
});

testTour
  .save()
  .then((doc) => {
    console.error('Test is saved Successfully ✅:', doc);
  })
  .catch((err) => {
    console.error('❌Error saving test tour 📛:', err);
  });

//Start server
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server listening on port: ${port}...`);
});
