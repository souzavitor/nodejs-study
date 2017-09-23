'use strict';

const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

// create user schema
const userSchema = new mongoose.Schema({
  name : String,
  email : String,
  username : String,
  password : String,
  checked_email : Boolean,
  email_verification_token : String,
  created_at : Date,
  updated_at : Date,
}, { versionKey: false });

userSchema.pre("save", function(next) {
  if (!this.created_at) {
    this.created_at = new Date();
  }
  this.updated_at = new Date();

  let user = this;
  let SALT_FACTOR = 5;

  if(!user.isModified('password')){
    return next();
  }

  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.checkPassword = function (passAttempt, cb) {
  bcrypt.compare(passAttempt, this.password, function(err, isMatch){
    if (err) {
      return cb(err);
    } else {
      return cb(null, isMatch);
    }
  });
};

module.exports = userSchema;