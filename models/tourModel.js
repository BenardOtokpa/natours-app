const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');

//MODELS
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A name must be provided'],
      unique: true,
      trim: true,
      maxlength: [40, 'Tour name must have less or equal than 40 characters'],
      minlength: [10, 'Tour name must have more or equal than 10 characters'],
      //validate: [validator.isAlpha, 'The name must only contain letters'],
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
      set: (val) => Math.round(val * 10) / 10,
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
    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.index({ slug: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

//Document Middleware: runs before .save() or .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', async function(next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id))
//   this.guides = await Promise.all(guidesPromises)

//   next()
// })

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

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangeAt',
  });
  next();
});

tourSchema.post(/^find/, function (doc, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);

  next();
});

//Aggregation Middleware
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   console.log(this.pipeline());

//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
