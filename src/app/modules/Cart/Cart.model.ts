import { Schema, model } from 'mongoose';
import { ICart } from './Cart.interface';
      
const cartSchema = new Schema<ICart>({
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
      
const CartModel = model<ICart>('Cart', cartSchema);
export default CartModel;
      