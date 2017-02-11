import mongoose = require("mongoose");

import { PlaceInterface } from '../interfaces/place.interface';
import { PlaceModel } from '../models/place.model';
import { placeSchema } from "../schemas/place.schema";

let Place : mongoose.Model<PlaceModel>;
let connection : mongoose.Connection = require('../factories/mongoose.factory').connection();
Place = connection.model('Place', placeSchema);

export = Place;
