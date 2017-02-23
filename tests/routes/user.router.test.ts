import * as mocha from 'mocha';
import * as chai from 'chai';
import * as jwt from 'jsonwebtoken';

import chaiHttp = require('chai-http');

import app from '../../src/app';

process.env.DB_NAME = 'nodejs_study_testing';

import mongoose = require("mongoose");

import { UserInterface } from '../../src/interfaces/user.interface';
import { UserModel } from '../../src/models/user.model';

let User = require('../../src/services/user.service');

chai.use(chaiHttp);
const expect = chai.expect;

describe('User router', () => {
  it('should be unauthorized', () => {
    return chai.request(app)
      .get('/api/v1/users')
      .catch(res => {
        expect(res.status).to.eql(401);
      });
  });

  it('should authenticate with email', (done) => {
    User.findOne().then(user => {
      chai.request(app)
        .post('/api/v1/users/authenticate')
        .send({username: user.email, password: '123456'})
        .then(res => {
          expect(res.type).to.eql('application/json');
          expect(res.status).to.eql(200);
          expect(res.body.data).to.exist;
          expect(res.body.data.token).to.exist;
          done();
        }).catch(err => {
          done(err);
        });
    }).catch(err => {
      done(err);
    });
  });

  it('should authenticate with username', (done) => {
    User.findOne().then(user => {
      chai.request(app)
        .post('/api/v1/users/authenticate')
        .send({username: user.username, password: '123456'})
        .then(res => {
          expect(res.type).to.eql('application/json');
          expect(res.status).to.eql(200);
          expect(res.body.data).to.exist;
          expect(res.body.data.token).to.exist;
          expect(res.body.data._id).to.exist;
          expect(res.body.data.name).to.exist;
          expect(res.body.data.email).to.exist;
          expect(res.body.data.username).to.exist;
          done();
        }).catch(err => {
          done(err);
        });
    }).catch(err => {
      done(err);
    });
  });

  it('should list users', (done) => {
    User.findOne().then(user => {
      let payload = {_id: user._id};
      let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 60 * 60 });
      chai.request(app)
        .get('/api/v1/users')
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

  it('should get one user', (done) => {
    User.findOne().then(user => {
      let payload = {_id: user._id};
      let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 60 * 60 });
      chai.request(app)
        .get('/api/v1/users/' + user._id)
        .set('Authorization', 'JWT ' + token)
        .then(res => {
          expect(res.type).to.eql('application/json');
          expect(res.status).to.eql(200);
          expect(res.body.data).to.exist;
          expect(res.body.data).to.be.an('object');
          expect(res.body.data._id).to.exist;
          expect(res.body.data.name).to.exist;
          expect(res.body.data.email).to.exist;
          expect(res.body.data.username).to.exist;
          expect(res.body.data.password).to.exist;
          expect(res.body.data.created_at).to.exist;
          expect(res.body.data.updated_at).to.exist;
          done();
        }).catch(err => {
          done(err);
        });
    }).catch(err => {
      done(err);
    });
  });

  it('should update the user', (done) => {
    User.findOne().then(user => {
      let payload = {_id: user._id};
      let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 60 * 60 });
      let oldUsername = user.username;
      chai.request(app)
        .put('/api/v1/users/' + user._id)
        .set('Authorization', 'JWT ' + token)
        .send({username: 'newusername ' + Date.now()})
        .then(res => {
          expect(res.type).to.eql('application/json');
          expect(res.status).to.eql(200);
          expect(res.body.data).to.exist;
          expect(res.body.data).to.be.an('object');
          expect(res.body.data._id).to.exist;
          expect(res.body.data.name).to.exist;
          expect(res.body.data.email).to.exist;
          expect(res.body.data.username).to.exist;
          expect(res.body.data.password).to.exist;
          expect(res.body.data.created_at).to.exist;
          expect(res.body.data.updated_at).to.exist;
          expect(res.body.data.username).not.to.be.equal(oldUsername);
          done();
        }).catch(err => {
          done(err);
        });
    }).catch(err => {
      done(err);
    });
  });

  it('should create a new user', () => {
    return chai.request(app)
      .post('/api/v1/users')
      .send({
        email : 'example@email.com',
        name : 'Example',
        username : 'example ' + Date.now(),
        password : '123456'
      }).then(res => {;
        expect(res.status).to.eql(200);
        expect(res.body.data).to.exist;
        expect(res.body.data).to.be.an('object');
        expect(res.body.data._id).to.exist;
        expect(res.body.data.name).to.exist;
        expect(res.body.data.email).to.exist;
        expect(res.body.data.username).to.exist;
        expect(res.body.data.password).to.exist;
        expect(res.body.data.created_at).to.exist;
        expect(res.body.data.updated_at).to.exist;
      });
  });
  it('should delete a user', (done) => {
    User.findOne().then(user => {
      let payload = {_id: user._id};
      let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 60 * 60 });
      chai.request(app)
        .del('/api/v1/users/'+ user._id)
        .set('Authorization', 'JWT ' + token)
        .then(res => {;
          expect(res.status).to.eql(204);
          done();
        });
    });
  });
});