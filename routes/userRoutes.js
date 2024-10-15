const express = require('express');

const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

//Routes
const router = express.Router();

//tours routes
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

//user routes
router.post('/signup', authController.signup);

module.exports = router;
