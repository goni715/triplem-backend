import { Types } from "mongoose";

export type TStockStatus = 'in_stock' | 'stock_out' | 'up_coming';

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
  status: "visible" | "hidden";
  stockStatus: TStockStatus;
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
  status?: "visible" | "hidden";
  stockStatus?: TStockStatus;
};
