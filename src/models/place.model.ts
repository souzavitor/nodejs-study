import { Document } from "mongoose";
import { PlaceInterface } from "../interfaces/place.interface";

export interface PlaceModel extends PlaceInterface, Document { }
