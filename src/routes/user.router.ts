import { Router, Request, Response, NextFunction } from 'express';

import mongoose = require("mongoose");

import { UserInterface } from '../interfaces/user.interface';
import { UserModel } from '../models/user.model';

import * as jwt from 'jsonwebtoken';
import * as UserService from '../services/user.service';

import { AuthService } from '../services/auth.service';

export class UserRouter {
  private router: Router

  /**
   * Initialize the UserRouter
   */
  constructor() {
    this.router = Router();
  }

  /**
   * GET all Users.
   */
  public getAll(req: Request, res: Response, next: NextFunction) {
    UserService.find({}).then(users => {
      res.send({
        data : users
      })
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
    let data = req.body;
    let user = new UserService(data);
    user.save().then(result => {
      res.send({
        data : result
      });
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
              let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 60 * 60 });
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
      user.email = data.email || user.email;
      user.username = data.username || user.username;
      user.password = data.password || user.password;
      res.send({data: user});
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

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  getRouter() {
    // public routes
    this.router.post('/authenticate', this.authenticate);
    this.router.post('/', this.createUser);

    // private routes
    this.router.get('/', AuthService.authenticate(), this.getAll);
    this.router.get('/:_id', AuthService.authenticate(), this.getById);
    this.router.put('/:_id', AuthService.authenticate(), this.update);
    this.router.delete('/:_id', AuthService.authenticate(), this.removeUser);

    return this.router;
  }
}
export default new UserRouter().getRouter();
