import * as mocha from 'mocha';
import * as dotenv from 'dotenv';

dotenv.config();
process.env.DB_NAME = 'nodejs_study_testing';

//use q promises
global.Promise = require('q').Promise;

//import mongoose
import mongoose = require("mongoose");

//use q library for mongoose promise
mongoose.Promise = global.Promise;

import { PlaceModel } from '../../src/models/place.model';

let chai = require("chai");
const expect = chai.expect;

describe('Place', () => {
  it('should return a mongoose Model', () => {
    return new Promise((resolve, reject) => {
      let Place : mongoose.Model<PlaceModel> = require('../../src/services/place.service');
      expect(Place.collection).to.exist;
      expect(Place.schema).to.exist;
      resolve(Place);
    });
  });
});