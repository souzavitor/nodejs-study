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

import { UserInterface } from '../../src/interfaces/user.interface';
import { UserModel } from '../../src/models/user.model';

let User = require('../../src/services/user.service');

let chai = require("chai");
const expect = chai.expect;

describe('User', () => {
  it('should create one user', () => {
    let user : UserInterface = {
      name : 'Admin',
      email : 'admin@example.com',
      username : 'admin',
      password : '123456'
    };
    return new User(user).save().then(result => {
      expect(result._id).to.exists;
      expect(result.email).to.be.equal(user.email);
      expect(result.name).to.be.equal(user.name);
      expect(result.username).to.be.equal(user.username);
      expect(result.password).to.exists;
    });
  });
  it('should find a user', () => {
    return User.findOne().then(result => {
      expect(result._id).to.exists;
      expect(result.email).to.exists;
      expect(result.username).to.exists;
      expect(result.name).to.exists;
      expect(result.password).to.exists;
    });
  });
  it('should check the user password', (done) => {
    User.findOne().then((result : any) => {
      result.checkPassword('123456', (err, isMatch) => {
        expect(isMatch).to.be.equal(true);
        done();
      });
    });
  });
  it('should delete some users', (done) => {
    User.count({}).then(result => {
      User.find({}).limit(result - 1).then(docs => {
        var ids = docs.map(doc => { return doc._id; });
        User.remove({_id: {$in: ids}}).then(res => {
          expect(res['result']).to.exists;
          expect(res['result'].n).to.exists;
          expect(res['result'].n).to.be.at.least(1);
          done();
        }).catch(ex => {
          done(ex);
        });
      });
    });
  });
  it('should update a user', (done) => {
    User.findOne().then(result => {
      let user = <UserModel>result;
      let oldName = user.name;
      user.name = Date.now() + ' Name';
      user.save().then(result => {
        expect(oldName).to.not.equal(result.name);
        done();
      }).catch(ex => {
        done(ex);
      });
    });
  });
});