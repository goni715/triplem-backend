

export interface IProduct {
  name: string;
  description?: string;
};

export type TProductQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string,
};
