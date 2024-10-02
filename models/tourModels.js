const mongoose = require('mongoose');
const slugify = require('slugify');

//MODELS
const tourSchema = new mongoose.Schema(
  {
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});
//Document Middleware: runs before .save() or .create()
tourSchema.pre('save', function () {
  this.;
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
