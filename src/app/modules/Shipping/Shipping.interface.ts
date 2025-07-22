import {Types} from "mongoose";

export interface IShipping {
  userId: Types.ObjectId;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string
};


