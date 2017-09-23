'use strict';

const mongoose = require('mongoose');

const placeSchema = require('../schemas/place.schema');

const connection = require('../factories/mongoose.factory');
const Place = connection.model('Place', placeSchema);

module.exports = Place;