import { Types } from "mongoose";

export interface IOrderItem {
  productId: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image: string;
  colorId?: Types.ObjectId;
  sizeId?: Types.ObjectId;
}

export type TPaymentStatus = "paid" | "unpaid" | "failled";
export type TDeliveryStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface IOrder {
  userId: Types.ObjectId;
  items: IOrderItem[];
  totalPrice: number;
  paymentMethod?: string;
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
