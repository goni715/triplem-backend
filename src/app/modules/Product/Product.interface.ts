import { Types } from "mongoose";

export type TStockStatus = 'In Stock' | 'Stock Out' | 'Up Coming';

export interface IProduct {
  name: string;
  slug: string;
  categoryId: Types.ObjectId;
  currentPrice: number;
  originalPrice?: number;
  discount: string;
  ratings: number;
  colors?: Types.ObjectId[];
  sizes?: Types.ObjectId[];
  status: TStockStatus;
  images: string[];
  introduction: string;
  description: string;
};

export type TProductQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string,
};
