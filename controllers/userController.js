const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');

//Users Handllers
exports.updateMe = (req, res, next) => {
  //create error if user post pasword data
  if (req.body.password || req.body.PasswordConfirm) {
    return next(
      new AppError(
        'This route is not for password Update, Please use /updateMyPassword.',
        400,
      ),
    );
  }
  //update user document
  response.status(200).json({
    status: 'success',
  });
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  //SEND RESPONSE
  res.status(200).json({
    status: 'Success',
    result: users.length,
    data: {
      users,
    },
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet Implimented!',
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet Implimented!',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet Implimented!',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet Implimented!',
  });
};
