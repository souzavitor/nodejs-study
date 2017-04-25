import { Schema } from "mongoose";

export var placeSchema: Schema = new Schema({
  user_id : Schema.Types.ObjectId,
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