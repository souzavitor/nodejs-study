'use strict';

const mongoose = require('mongoose');

const userSchema = require('../schemas/user.schema');

const connection = require('../factories/mongoose.factory');
const User = connection.model('User', userSchema);

module.exports = User;
