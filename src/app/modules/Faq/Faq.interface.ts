

export interface IFaq {
  question: string;
  slug: string;
  answer: string;
  category?: string;
  isActive: boolean;
};

export type TFaqQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  isActive?: string;
  category?: string;
};
