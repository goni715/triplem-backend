

export interface IColor {
  name: string;
  slug: string;
  hexCode: string;
};

export type TColorQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};
