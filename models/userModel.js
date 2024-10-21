const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    minlength: [3, 'Name must be between 3 and 50 characters'],
    maxlength: [50, 'Name must be between 3 and 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
    lowercase: true,
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false, //hide this field in queries
  },

  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      //this only works on CREATE n SAVE!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords do not match! ',
    },
  },
  photo: String,
  passwordChangeAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

// pre-save middleware
userSchema.pre('save', async function (next) {
  //run function if password was modified
  if (!this.isModified('password')) return next();

  //hash the password before saving with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // delete passwordConfirm field to prevent saving it in the database
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  canditaePassword,
  userPassword,
) {
  return await bcrypt.compare(canditaePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangeAt) {
    const changedTimestamp = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10,
    );
    return JWTTimestamp < changedTimestamp;
  }

  //false means not changed password
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 10000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
