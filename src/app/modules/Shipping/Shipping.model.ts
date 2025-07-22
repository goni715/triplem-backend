import { Schema, model } from 'mongoose';
import { IShipping } from './Shipping.interface';

const shippingSchema = new Schema<IShipping>({
  userId: { type: Schema.Types.ObjectId, unique: true, required: true, ref: "User" },
  streetAddress: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  zipCode: {
    type: String,
    required: [true, "zipCode is required"],
    trim: true,
    minlength: 5
  },
}, {
  timestamps: true,
  versionKey: false
})

const ShippingModel = model<IShipping>('Shipping', shippingSchema);
export default ShippingModel;
