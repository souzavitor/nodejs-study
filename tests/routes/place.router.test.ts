import * as mocha from 'mocha';
import * as chai from 'chai';
import * as jwt from 'jsonwebtoken';

import chaiHttp = require('chai-http');

import app from '../../src/app';

process.env.DB_NAME = 'nodejs_study_testing';

import mongoose = require("mongoose");

import { PlaceInterface } from '../../src/interfaces/place.interface';
import { PlaceModel } from '../../src/models/place.model';

let Place = require('../../src/services/place.service');
let User = require('../../src/services/user.service');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Place router', () => {
  it('should list places', (done) => {
    User.findOne().then(user => {
      let payload = {_id: user._id};
      let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 60 * 60 });
      chai.request(app)
        .get('/api/v1/places')
        .set('Authorization', 'JWT ' + token)
        .then(res => {
          expect(res.type).to.eql('application/json');
          expect(res.status).to.eql(200);
          expect(res.body.data).to.exist;
          expect(res.body.data).to.be.an('array');
          done();
        }).catch(err => {
          done(err);
        });
    }).catch(err => {
      done(err);
    });
  });

  it('should get one place', (done) => {
    User.findOne().then(user => {
      let payload = {_id: user._id};
      let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 60 * 60 });
      Place.findOne().then(place => {
        chai.request(app)
          .get('/api/v1/places/' + place._id)
          .set('Authorization', 'JWT ' + token)
          .then(res => {;
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
            done();
          }).catch(err => {
            done(err);
          });
      }).catch(err => {
        done(err);
      })
    }).catch(err => {
      done(err);
    });
  });

  it('should create a new place', (done) => {
    User.findOne().then(user => {
      let payload = {_id: user._id};
      let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 60 * 60 });
      chai.request(app)
        .post('/api/v1/places')
        .set('Authorization', 'JWT ' + token)
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
          done();
        }).catch(err => {
          done(err);
        });
    }).catch(err => {
      done(err);
    });
  });

  it('should delete a place', (done) => {
    Place.findOne().then(place => {
      User.findOne().then(user => {
        let payload = {_id: user._id};
        let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 60 * 60 });
        chai.request(app)
          .del('/api/v1/places/'+ place._id)
          .set('Authorization', 'JWT ' + token)
          .then(res => {;
            expect(res.status).to.eql(204);
            done();
          }).catch(err => {
            done(err);
          });
      }).catch(err => {
        done(err);
      });
    }).catch(err => {
      done(err);
    });
  });
});