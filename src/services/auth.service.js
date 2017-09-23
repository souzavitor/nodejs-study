'use strict';

const passport = require('passport');
const Strategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const UserService = require('./user.service');

var localOptions = {
  usernameField: 'email'
};

var jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: process.env.JWT_SECRET
};

var jwtLogin = new Strategy(jwtOptions, (payload, done) => {
  UserService.findById(payload._id, (err, user) => {
    if (err) {
      return done(err, false);
    }
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});
passport.use(jwtLogin);

exports.initialize = () => {
  return passport.initialize();
}
exports.authenticate = () =>{
  return passport.authenticate("jwt", {session : false, assignProperty: 'user'});
}
