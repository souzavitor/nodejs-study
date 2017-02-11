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

import { PlaceInterface } from '../../src/interfaces/place.interface';
import { PlaceModel } from '../../src/models/place.model';

let Place : mongoose.Model<PlaceModel> = require('../../src/services/place.service');

let chai = require("chai");
const expect = chai.expect;

describe('Place', () => {
  it('should create one place', () => {
    let place : PlaceInterface = {
      address : 'Rua Alexandre Dias',
      number_address : '378',
      zip_code : '08225250',
      country : 'Brasil',
      state : 'SP',
      city : 'São Paulo'
    };
    return new Place(place).save().then(result => {
      expect(result._id).to.exists;
      expect(result.address).to.be.equal(place.address);
      expect(result.number_address).to.be.equal(place.number_address);
      expect(result.zip_code).to.be.equal(place.zip_code);
      expect(result.country).to.be.equal(place.country);
      expect(result.state).to.be.equal(place.state);
      expect(result.city).to.be.equal(place.city);
    });
  });
  it('should find a place', () => {
    return Place.findOne().then(result => {
      expect(result._id).to.exists;
      expect(result.address).to.exists;
      expect(result.number_address).to.exists;
      expect(result.zip_code).to.exists;
      expect(result.country).to.exists;
      expect(result.state).to.exists;
      expect(result.city).to.exists;
    });
  });
  it('should delete some places', (done) => {
    Place.count({}).then(result => {
      Place.find({}).limit(result - 1).then(docs => {
        var ids = docs.map(doc => { return doc._id; });
        Place.remove({_id: {$in: ids}}).then(res => {
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
  it('should update a place', (done) => {
    Place.findOne().then(result => {
      let place = <PlaceModel>result;
      let oldAddress = place.address;
      place.address = Date.now() + ' Test';
      place.save().then(result => {
        expect(oldAddress).to.not.equal(result.address);
        done();
      }).catch(ex => {
        done(ex);
      });
    });
  });
});