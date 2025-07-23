import { Schema, model } from 'mongoose';
import { IProduct } from './Product.interface';
      
const productSchema = new Schema<IProduct>({
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
      
const ProductModel = model<IProduct>('Product', productSchema);
export default ProductModel;
      