import { Schema, model } from 'mongoose';
import { IOrder } from './Order.interface';
      
const orderSchema = new Schema<IOrder>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  }
}, {
  timestamps: true,
  versionKey: false
})
      
const OrderModel = model<IOrder>('Order', orderSchema);
export default OrderModel;
      