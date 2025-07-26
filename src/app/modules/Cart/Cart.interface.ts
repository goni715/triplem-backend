

export interface IO {
  productId: Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  color?: Types.ObjectId;
  size?: Types.ObjectId;
}

export type TCartQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string,
};
