import { Schema, model } from 'mongoose';
import { IOrder } from './Order.interface';
      
const orderSchema = new Schema<IOrder>({
  name: { 
    type: String,
    required: true
  },
  description: { 
    type: String
  }
}, {
    timestamps: true,
    versionKey: false
})
      
const OrderModel = model<IOrder>('Order', orderSchema);
export default OrderModel;
      