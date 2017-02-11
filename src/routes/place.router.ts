import { Router, Request, Response, NextFunction } from 'express';

import mongoose = require("mongoose");

import { PlaceInterface } from '../interfaces/place.interface';
import { PlaceModel } from '../models/place.model';

import * as PlaceService from '../services/place.service';

export class PlaceRouter {
  private router: Router

  /**
   * Initialize the PlaceRouter
   */
  constructor() {
    this.router = Router();
  }

  /**
   * GET all Places.
   */
  public getAll(req: Request, res: Response, next: NextFunction) {
    PlaceService.find({}).then(places => {
      res.send({
        data : places
      })
    }).catch(err => {
      res.status(500);
      res.send({
        data: 'service not available'
      })
    });
  }

  public createPlace(req: Request, res: Response, next: NextFunction) {
    let data = req.body;
    let place = new PlaceService(data);
    place.save().then(result => {
      res.send({
        data : result
      });
    });
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  getRouter() {    
    this.router.get('/', this.getAll);
    this.router.post('/', this.createPlace);
    return this.router;
  }
}
export default new PlaceRouter().getRouter();
