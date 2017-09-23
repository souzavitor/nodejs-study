'use strict';

const mongoose = require("mongoose");
const router = require('express').Router();

// get services
const PlaceService = require('../services/place.service');
const AuthService = require('../services/auth.service');

/**
 * Register routes for place resource
 *
 * @param Router router
 * @return void
 */
function registerRoutes(router) {
  router.get('/:user_id', AuthService.authenticate(), getAll);
  router.post('/', AuthService.authenticate(), createPlace);
  router.get('/:_id', AuthService.authenticate(), getById);
  router.delete('/:_id', AuthService.authenticate(), removePlace);
}

/**
 * GET all places by user_id
 *
 * @param Request req
 * @param Response res
 * @param NextFunction next
 * @return void
 */
function getAll(req, res, next) {
  PlaceService.find({user_id : req.params.user_id}).then(places => {
    res.send({
      data : places
    })
  }).catch(err => {
    res.status(500);
    res.send({data: 'service not available'})
  });
}

/**
 * Get place by id
 *
 * @param Request req
 * @param Response res
 * @param NextFunction next
 * @return void
 */
function getById(req, res, next) {
  PlaceService.findById(req.params._id).then(place => {
    res.send({data: place})
  }).catch(ex => {
    res.status(500);
    res.send({data: 'service not available'})
  });
}

/**
 * Remove place by id
 *
 * @param Request req
 * @param Response res
 * @param NextFunction next
 * @return void
 */
function removePlace(req, res, next) {
  PlaceService.findById(req.params._id).then(place => {
    place.remove({_id : place._id}).then(result => {
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
 * Create place
 *
 * @param Request req
 * @param Response res
 * @param NextFunction next
 * @return void
 */
function createPlace(req, res, next) {
  let data = req.body;
  let place = new PlaceService(data);
  place.save().then(result => {
    res.send({
      data : result
    });
  });
}

registerRoutes(router);

module.exports = router;