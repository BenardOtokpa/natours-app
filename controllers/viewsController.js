const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  // get tour data from collection
  const tours = await Tour.find();
  //build template

  //render that tamplate using data from above
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // get data for requested tour (incluidng reviews and tour guides)
  const slug = req.params.slug;

  const tour = await Tour.findOne({ slug: slug }).populate({
    path: 'reviews',
    fields: 'user rating review',
  });
  if (!tour) {
    return next(new AppError('No tour found with that id', 404));
  }
  // build template

  //render the template with this data
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.getLogInForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};
