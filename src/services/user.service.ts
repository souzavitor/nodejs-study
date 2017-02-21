import mongoose = require("mongoose");

import { UserInterface } from '../interfaces/user.interface';
import { UserModel } from '../models/user.model';
import { userSchema } from "../schemas/user.schema";

let connection : mongoose.Connection = require('../factories/mongoose.factory').connection();
let User = connection.model('User', userSchema);

export = User;
