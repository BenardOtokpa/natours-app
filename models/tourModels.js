const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

//MODELS
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A name must be provided'],
      unique: true,
      trim: true,
      maxlength: [40, 'Tour name must have less or equal than 40 characters'],
      minlength: [10, 'Tour name must have more or equal than 10 characters']
    },
    slug: String,
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either easy or medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: { type: Number, default: 0 },
    price: {
      type: Number,
      required: [true, 'A price must be provided'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          //this only points to current doc on the NEW document creation
          return val < this.price;
        },
        message:
          'Discount price ({VALUE}) must be lower than the original price',
      },
    },
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
    secretTour: {
      type: Boolean,
      default: false,
    },
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
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

//Query Middleware
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});
tourSchema.post(/^find/, function (doc, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);

  next();
});

//Aggregation Middleware
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
