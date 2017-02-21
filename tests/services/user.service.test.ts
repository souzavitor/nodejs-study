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

import { UserModel } from '../../src/models/user.model';

let chai = require("chai");
const expect = chai.expect;

describe('User', () => {
  it('should return a mongoose Model', () => {
    return new Promise((resolve, reject) => {
      let User : mongoose.Model<UserModel> = require('../../src/services/user.service');
      expect(User.collection).to.exist;
      expect(User.schema).to.exist;
      resolve(User);
    });
  });
});