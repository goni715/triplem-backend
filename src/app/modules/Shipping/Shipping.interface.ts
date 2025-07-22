import {Types} from "mongoose";

export interface IShipping {
  userId: Types.ObjectId;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string
};

export type TShippingQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string,
};
