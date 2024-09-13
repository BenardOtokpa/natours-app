const mongoose = require('mongoose');

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

module.exports = Tour;
