import { Types } from "mongoose";

export interface IProduct {
  name: string;
  slug: string;
  categoryId: Types.ObjectId;
  currentPrice: number;
  originalPrice?: number;
  discount: string;
  ratings: number;
  colors?: string[];
  sizes?: Types.ObjectId[];
  status: 'In Stock' | 'Stock Out' | 'Up Comming';
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
