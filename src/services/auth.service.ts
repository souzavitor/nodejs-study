import * as passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import * as UserService from './user.service';

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

export class AuthService {
  static initialize() {
      return passport.initialize();
  }
  static authenticate() {
    return passport.authenticate("jwt", {session : false})
  }
}
