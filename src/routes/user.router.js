'use strict';

const mongoose = require("mongoose");

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserService = require('../services/user.service');

const validator = require('express-validator');

const AuthService = require('../services/auth.service');
const EmailService = require('../services/email.service');

/**
 * Take each handler, and attach to one of the Express.Router's
 * endpoints.
 *
 * @param Router router
 * @return void
 */
function registerRoutes(router) {
  registerMiddleware(router);

  // public routes
  router.post('/authenticate', authenticate);
  router.post('/', createUser);
  // router.post('/send-email-verification/:_id', sendEmailVerification);

  // private routes
  router.get('/', AuthService.authenticate(), getAll);
  router.get('/:_id', AuthService.authenticate(), getById);
  router.put('/:_id', AuthService.authenticate(), updateUser);
  router.delete('/:_id', AuthService.authenticate(), removeUser);
  // router.get('/check-email-verification/:token', AuthService.authenticate(), checkEmailVerification);
}

function registerMiddleware(router) {
  router.use(validator({
    customValidators: {
      isUsernameTaken : (param, _id) => {
        return new Promise((resolve, reject) => {
          let conditions = {username: param};
          if (typeof _id !== 'undefined') {
            conditions['_id'] = {$ne: _id};
          }
          return UserService.findOne(conditions)
            .then(user => {
              if (user) {
                return reject(user);
              }
              return resolve(true);
            })
            .catch(err => {
              resolve(err);
            });
        });
      }
    }
  }));
}

/**
 * GET all Users
 *
 * @param Request req
 * @param Response res
 * @param NextFunction next
 * @return void
 */
function getAll(req, res, next) {
  UserService.find({}, {password: false}).then(users => {
    res.send({data : users})
  }).catch(err => {
    res.status(500);
    res.send({data: 'service not available'})
  });
}

/**
 * Remove a user by its Id
 *
 * @param Request req
 * @param Response res
 * @param NextFunction next
 * @return void
 */
function removeUser(req, res, next) {
  UserService.findById(req.params._id).then(user => {
    UserService.remove({_id : user._id}).then(result => {
      res.status(204);
      res.send();
    }).catch(ex => {
      res.status(500);
      res.send({data: 'service not available'})
    });
  }).catch(ex => {
    res.status(500);
    res.send({data: 'service not available'})
  });
}

/**
 * Create a new User
 *
 * @param Request req
 * @param Response res
 * @param NextFunction next
 * @return void
 */
function createUser(req, res, next) {
  // validate the fields in the body
  req.checkBody('email', 'Email is invalid').isEmail();
  req.checkBody('username')
    .notEmpty().withMessage('Username is required')
    .isUsernameTaken().withMessage('Username already registered');
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('name', 'Name is required').notEmpty();

  req.asyncValidationErrors().then(() => {
    let data = req.body;
    data.checked_email = false;
    let user = new UserService(data);
    user.save().then((result) => {
      res.status(201);
      res.send({
        data: {
          _id : result._id,
          name : result.name,
          email : result.email,
          username : result.username,
          created_at: result.created_at
        }
      });
    }).catch(err => {
      res.status(500).send({data : 'something is wrong'});
    });
  }).catch(errors => {
    res.status(400).send({data: errors});
  });
}

/**
 * Authenticate an user
 *
 * @param Request req
 * @param Response res
 * @param NextFunction next
 * @return void
 */
function authenticate(req, res, next) {
  if (req.body.username && req.body.password) {
    let username = req.body.username;
    let password = req.body.password;
    let conditions = {$or : [{email : username}, {username : username}]};
    UserService.findOne(conditions).then((user) => {
      if (user) {
        user.checkPassword(password, (err, isMatch) => {
          if (err) {
            res.sendStatus(401);
          } else if (isMatch) {
            let payload = {_id: user._id};
            let token = jwt.sign(payload, process.env.JWT_SECRET);
            res.json({
              data: {
                _id : user._id,
                email : user.email,
                name : user.name,
                username : user.username,
                token: token
              }
            });
          } else {
            res.status(401);
            res.send({error: 'Username and/or password invalid'});
          }
        });
      } else {
        res.status(401);
        res.send({error: 'Username and/or password invalid'});
      }
    }).catch(err => {
      res.status(500);
      res.send({error: 'Something is not right'})
    });
  } else {
    res.sendStatus(401);
  }
}

/**
 * Update an user
 *
 * @param Request req
 * @param Response res
 * @param NextFunction next
 * @return void
 */
function updateUser(req, res, next) {
  let data = req.body;
  UserService.findById(req.params._id).then((user) => {

    // validate the fields in the body
    req.checkBody('email', 'Email is invalid').isEmail();

    req.asyncValidationErrors().then(() => {
      user.name = data.name || user.name;
      if (typeof data.email !== 'undefined') {
        user.email = data.email;
        user.checked_email = false;
      }
      user.password = data.password || user.password;
      user.save().then((newUser) => {
        res.json({
          data: {
            _id : newUser._id,
            email : newUser.email,
            name : newUser.name,
            username : newUser.username,
            created_at: newUser.created_at,
            updated_at: newUser.updated_at
          }
        });
      }).catch(ex => {
        res.status(500);
        res.send({data: 'service not available'})
      });
    }).catch(errors => {
      res.status(400).send({data: errors});
    });
  }).catch(ex => {
    res.status(500);
    res.send({data: 'service not available'})
  });
}

/**
 * GET one user
 *
 * @param Request req
 * @param Response res
 * @param NextFunction next
 * @return void
 */
function getById(req, res, next) {
  UserService.findById(req.params._id).then(user => {
    res.send({data: user});
  }).catch(ex => {
    res.status(500);
    res.send({data: 'service not available'})
  });
}

/**
 * Send an email verification
 *
 * @param Request req
 * @param Response res
 * @param NextFunction next
 * @return void
 */
function sendEmailVerification(req, res, next) {
  let key = bcrypt.genSaltSync(8);
  UserService.findById(req.params._id).then((user) => {
    user.email_verification_token = key;
    user.save().then((savedUser) => {
      let email = new EmailModel();
      email.to = user.email;
      email.template = "email-verification";
      email.subject = "Hey, please check your email!";
      email.data = savedUser;
      EmailService.queueEmail(email).then((result) => {
        res.status(201);
        res.send({data: 'OK'});
      }).catch(ex => {
        res.status(500);
        res.send({data: 'service not available. Queue error.'})
      });
    }).catch(ex => {
      res.status(500);
      res.send({data: 'service not available. Database error save token'})
    });
  }).catch(ex => {
    res.status(500);
    res.send({data: 'service not available. Database error could not find user'})
  });
}

/**
 * Check if the email verification is right
 *
 * @param Request req
 * @param Response res
 * @param NextFunction next
 * @return void
 */
function checkEmailVerification(req, res, next) {
  if (!req.params.token) {
    res.status(400);
    res.send({data: [{param: 'token', msg: 'verification token value is missing'}]});
  }

  let key = decodeURIComponent(req.params.token);
  UserService.update(
    {_id: req.user._id, email_verification_token: key},
    {$set : {
      checked_email: true,
      email_verification_token : ''
    }}
  ).then((result) => {
    if (result.nModified === 1) {
      res.status(200);
      res.send({data: 'OK'});
    } else {
      res.status(400);
      res.send({data: 'verification token is not right'});
    }
  }).catch(ex => {
    res.status(500);
    res.send({data: 'service not available.'})
  });
}

var router = require('express').Router();

registerRoutes(router);

module.exports = router;
