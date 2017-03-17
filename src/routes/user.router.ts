import { Router, Request, Response, NextFunction } from 'express';

import mongoose = require("mongoose");

import { UserInterface } from '../interfaces/user.interface';
import { UserModel } from '../models/user.model';
import { EmailModel } from '../models/email.model';

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as UserService from '../services/user.service';

import validator = require('express-validator');

import { AuthService } from '../services/auth.service';
import { EmailService } from '../services/email.service';

export class UserRouter {
  private router: Router

  /**
   * Initialize the UserRouter
   */
  constructor() {
    this.router = Router();
  }

  public middleware() {
    this.router.use(validator({
      customValidators: {
        isUsernameTaken : (param, _id) => {
          return new Promise((resolve, reject) => {
            let conditions = {
              username: param
            };
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
                resolve(err)
              });
          });
        }
      }
    }));
  }

  /**
   * GET all Users.
   */
  public getAll(req: Request, res: Response, next: NextFunction) {
    UserService.find({}, {password: false}).then(users => {
      res.send({data : users})
    }).catch(err => {
      res.status(500);
      res.send({data: 'service not available'})
    });
  }

  public removeUser(req: Request, res: Response, next: NextFunction) {
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

  public createUser(req: Request, res: Response, next: NextFunction) {
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
      user.save().then((result : any) => {
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

  public authenticate(req: Request, res: Response, next: NextFunction) {
    if (req.body.username && req.body.password) {
      let username = req.body.username;
      let password = req.body.password;
      let conditions = {$or : [{email : username}, {username : username}]};
      UserService.findOne(conditions).then((user : UserModel) => {
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
            }
          });
        } else {
          res.sendStatus(401);
        }
      }).catch(err => {
        res.status(500);
        res.send({data: 'service not available'})
      });
    } else {
      res.sendStatus(401);
    }
  }

  update(req: Request, res: Response, next: NextFunction) {
    let data = req.body;
    UserService.findById(req.params._id).then((user : UserModel) => {
      user.name = data.name || user.name;
      if (typeof data.email !== 'undefined') {
        user.email = data.email;
        user.checked_email = false;
      }
      user.password = data.password || user.password;
      user.save().then((newUser : UserModel) => {
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
    }).catch(ex => {
      res.status(500);
      res.send({data: 'service not available'})
    });
  }

  getById(req: Request, res: Response, next: NextFunction) {
    UserService.findById(req.params._id).then(user => {
      res.send({data: user});
    }).catch(ex => {
      res.status(500);
      res.send({data: 'service not available'})
    });
  }

  sendEmailVerification(req: Request, res: Response, next: NextFunction) {
    let key = bcrypt.genSaltSync(8);
    UserService.findById(req.params._id).then((user : UserModel) => {
      user.email_verification_token = key;
      user.save().then((savedUser : UserModel) => {
        let email = new EmailModel();
        email.to = user.email;
        email.template = "email-verification";
        email.subject = "Verification email";
        email.data = user;
        EmailService.queueEmail(email).then((result : any) => {
          res.status(201);
          res.send({data: 'OK'});
        }).catch(ex => {
          res.status(500);
          res.send({data: 'service not available'})
        });
      }).catch(ex => {
        res.status(500);
        res.send({data: 'service not available'})
      });
    }).catch(ex => {
      res.status(500);
      res.send({data: 'service not available'})
    });
  }

  checkEmailVerification(req: Request, res: Response, next: NextFunction) {

  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  getRouter() {
    this.middleware();
    // public routes
    this.router.post('/authenticate', this.authenticate);
    this.router.post('/', this.createUser);

    // private routes
    this.router.get('/', AuthService.authenticate(), this.getAll);
    this.router.get('/:_id', AuthService.authenticate(), this.getById);
    this.router.put('/:_id', AuthService.authenticate(), this.update);
    this.router.delete('/:_id', AuthService.authenticate(), this.removeUser);

    this.router.post('/send-email-verification/:_id', this.sendEmailVerification);
    this.router.get('/check-email-verification/:_id', this.checkEmailVerification);

    return this.router;
  }
}
export default new UserRouter().getRouter();
