
type TNewStatus = 'subscribed' | 'unsubscribed';

export interface INewsletter {
  email: string;
  subscribedAt: Date;
  status: TNewStatus;
};

export type TContactQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: TNewStatus,
};
