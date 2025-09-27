import { Types } from "mongoose";

export interface IOrderItem {
  productId: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  total: number;
  image: string;
  colorId?: Types.ObjectId;
  size?: string;
}

export type TPaymentStatus = "paid" | "unpaid" | "failled";
export type TDeliveryStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface IOrder {
  token: string;
  userId: Types.ObjectId;
  products: IOrderItem[];
  totalPrice: number;
  transactionId: string;
  paymentMethod?: string;
  paymentId: string;
  stripeFee: number;
  netAmount: number;
  paymentStatus?: TPaymentStatus,
  status: TDeliveryStatus
  deliveryAt?: Date;
};

export type TOrderQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string,
};
export type TUserOrderQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string,
};
