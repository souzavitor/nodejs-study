'use strict';

const mongoose = require("mongoose");

// create place schema
const placeSchema = new mongoose.Schema({
  user_id : mongoose.Schema.Types.ObjectId,
  label : String,
  address : String,
  number_address : String,
  zip_code : String,
  country : String,
  state : String,
  city : String,
  coordinates: Array,
  created_at : Date
}, { versionKey: false });
placeSchema.pre("save", function(next) {
  if (!this.created_at) {
    this.created_at = new Date();
  }
  next();
});
exports.placeSchema = placeSchema;