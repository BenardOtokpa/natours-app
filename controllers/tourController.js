const Tour = require('../models/tourModels');
const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

//Tours Handlers
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name, price, ratingsAverage, difficulty';
  next();
};

exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);
  res.status(200).json({
    status: 'Success',
    message: 'Stats calculated successfully',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $addFields: {
        startDateConverted: {
          $dateFromString: {
            dateString: {
              $concat: [
                { $substr: ['$startDates', 0, 10] }, // Extract the 'YYYY-MM-DD' part
                'T',
                { $substr: ['$startDates', 11, 5] }, // Extract the 'HH:MM' part
                ':00Z', // Add seconds and UTC timezone
              ],
            },
          },
        },
      },
    },

    {
      $match: {
        startDateConverted: {
          $gte: new Date(`${year}-01-01T00:00:00Z`),
          $lte: new Date(`${year}-12-31T23:59:59Z`),
        },
      },
    },
    {
      $group: {
        _id: {
          $month: '$startDateConverted',
        },
        numOfTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numOfTourStarts: -1,
      },
    },
  ]);
  res.status(200).json({
    status: 'Success',
    message: 'Stats calculated successfully',
    data: {
      plan,
    },
  });
});
