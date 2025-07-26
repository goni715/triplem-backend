import { Types } from "mongoose";

export interface IOrderItem {
  productId: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image: string;
  color?: Types.ObjectId;
  size?: Types.ObjectId;
}

export type TPaymentStatus = "paid" | "unpaid";
export type TDeliveryStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface IOrder {
  userId: Types.ObjectId;
  items: IOrderItem[];
  paymentMethod?: string;
  paymentStatus?: TPaymentStatus,
  status: TDeliveryStatus
};

export type TOrderQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string,
};
