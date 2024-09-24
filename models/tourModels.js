const mongoose = require('mongoose');

//MODELS
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A name must be provided'],
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'A duration must be provided'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'Tour must have a maximum group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A difficulty must be provided'],
  },
  ratingsAverage: { type: Number, default: 4.5 },
  ratingsQuantity: { type: Number, default: 0 },
  price: {
    type: Number,
    required: [true, 'A price must be provided'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    required: [true, 'A summary must be provided'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A cover image must be provided'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  startDate: [Date],
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
