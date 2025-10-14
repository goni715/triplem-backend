import { Schema, model } from 'mongoose';
import { IProduct } from './Product.interface';

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Category"
  },
  currentPrice: {
    type: Number,
    required: true,
    trim: true
  },
  originalPrice: {
    type: Number,
    default: 0,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    trim: true,
    validate: {
      validator: Number.isInteger,
      message: "Quantity must be an integer value",
    },
    min: [0, "quantity cannot be negative"],
  },
  discount: {
    type: String,
    default: ""
  },
  ratings: {
    type: Number,
    trim: true,
    default: 0,
    max: 5
  },
  colors: [
    {
      type: Schema.Types.ObjectId,
      ref: "Color"
    }
  ],
  sizes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Size"
    }
  ],
  introduction: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['visible', 'hidden'],
    default: "visible"
  },
  images: {
    type: [String],
    required: true
  }
}, {
  timestamps: true,
  versionKey: false
})

const ProductModel = model<IProduct>('Product', productSchema);
export default ProductModel;
