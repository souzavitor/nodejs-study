import * as passport from 'passport';
import { Strategy, StrategyOptions, JwtFromRequestFunction } from 'passport-jwt';
import { Request } from 'express';

import * as UserService from './user.service';

let cookieExtractor : JwtFromRequestFunction = (req : Request) : string => {
  let token;
  console.log(req);
  if (req && req.cookies) {
    token = req.cookies['jwt'];
    console.log(req.cookies);
  }
  return token;
}

let jwtOptions : StrategyOptions = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET
};

let jwtLogin = new Strategy(jwtOptions, (payload, done) => {
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
