const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.chechID = (req, res, next, val) => {
  console.log(`Tour ID is ${val}`);
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'Fail',
      message: 'Invalid ID',
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  console.log('Checking body data');
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'Fail',
      message: 'Missing name or price in request body',
    });
  }
  next();
}

//Tours Handlers
exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'Success',
    requestAt: req.requestTime,
    data: {
      tours,
    },
  });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].Id + 1;
  const newTour = Object.assign({ Id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'Success',
        message: 'New tour created successfully',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

exports.getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;

  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'Success',
    data: {
      tour: tour,
    },
  });
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
