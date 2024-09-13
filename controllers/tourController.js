const Tour = require('../models/tourModels');

// Mock data for testing use Json file
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

//Tours Handlers
exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'Success',
    // requestAt: req.requestTime,
    // data: {
    //   tours,
    // },
  });
};

exports.createTour = async (req, res) => {
  try {
    // const newTour = new Tour({})
    // newTour.save()

    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'Success',
      message: 'New tour created successfully',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Failed to create tour',
      message: err,
    });
  }
};

exports.getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;

  // const tour = tours.find((el) => el.id === id);

  // res.status(200).json({
  //   status: 'Success',
  //   data: {
  //     tour: tour,
  //   },
  // });
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'Success',
    message: 'Tour updated successfully',
    data: {
      tour: 'Update successfully',
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'Success',
    message: 'Tour Deleted successfully',
    data: null,
  });
};
