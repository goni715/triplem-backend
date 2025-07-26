

export interface ICart {
  name: string;
  description?: string;
};

export type TCartQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string,
};
