import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import app from '../../src/app';

process.env.DB_NAME = 'nodejs_study_testing';

import mongoose = require("mongoose");

import { PlaceInterface } from '../../src/interfaces/place.interface';
import { PlaceModel } from '../../src/models/place.model';

let Place : mongoose.Model<PlaceModel> = require('../../src/services/place.service');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Place router', () => {
  it('should be json', () => {
    return chai.request(app).get('/api/v1/places')
        .then(res => {
          expect(res.type).to.eql('application/json');
        });
  });
  it('should return status code ok', () => {
    return chai.request(app).get('/api/v1/places')
        .then(res => {
          expect(res.status).to.eql(200);
          expect(res.body.data).to.exist;
          expect(res.body.data).to.be.an('array');
        });
  });
  it('should create a new place', () => {
    return chai.request(app)
      .post('/api/v1/places')
      .send({
        address : 'Street Nice',
        number_address : '378',
        zip_code : '08225250',
        country : 'Brazil',
        city : 'São Paulo',
        state : 'SP',
        coordinates : [10.32, -23.238]
      }).then(res => {;
        expect(res.status).to.eql(200);
        expect(res.body.data).to.exist;
        expect(res.body.data).to.be.an('object');
        expect(res.body.data._id).to.exist;
        expect(res.body.data.address).to.exist;
        expect(res.body.data.number_address).to.exist;
        expect(res.body.data.zip_code).to.exist;
        expect(res.body.data.country).to.exist;
        expect(res.body.data.city).to.exist;
        expect(res.body.data.state).to.exist;
        expect(res.body.data.coordinates).to.exist;
        expect(res.body.data.created_at).to.exist;
      });
  });
  it('should delete a place', (done) => {
    Place.findOne().then(place => {
      chai.request(app)
        .del('/api/v1/places/'+ place._id)
        .then(res => {;
          expect(res.status).to.eql(204);
          done();
        });
    });
  });
});