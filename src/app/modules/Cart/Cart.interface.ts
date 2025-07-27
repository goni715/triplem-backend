import { Types } from "mongoose";

export interface ICart {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  //name: string;
  price: number;
  quantity: number;
  image?: string;
  colorId?: Types.ObjectId;
  sizeId?: Types.ObjectId;
}

export type TCartQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string,
};
