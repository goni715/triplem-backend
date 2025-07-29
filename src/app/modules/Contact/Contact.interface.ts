

export interface IContact {
  email: string;
  phone: string;
  message: string;
  replyText?: string;
};

export type TContactQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string,
};
