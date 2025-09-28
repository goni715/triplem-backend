import { Schema, model } from 'mongoose';
import { IOrder, IOrderItem } from './Order.interface';

const orderItemSchema = new Schema<IOrderItem>({
  productId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Product"
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    trim: true,
    min: 1
  },
  quantity: {
    type: Number,
    required: true,
    trim: true,
    min: 1
  },
  total: {
    type: Number,
    required: true,
    trim: true,
    min: 1
  },
  image: {
    type: String,
    required: true,
    trim: true
  },
  colorId: {
    type: Schema.Types.ObjectId,
    ref: "Color"
  },
  size: {
    type: String
  },
}, {
  timestamps: false,
  versionKey: false
})

      
const orderSchema = new Schema<IOrder>({
  token: {
    type: String,
    unique: true,
    required: true,
    minlength: [6, "Token must be 6 characters long"],
    maxlength: [6, "Token must be 6 characters long"]
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  products: {
    type: [orderItemSchema],
    required: true,
    validate: {
      validator: function (value: IOrderItem[]) {
        return value.length > 0;
      },
      message: "At least one product is required in the order."
    }
  },
  totalPrice: { //amount
    type: Number,
    required: true,
  },
  transactionId: {
    type: String,
    unique: true,
    trim: true
  },
  paymentId: {
    type: String,
    // unique: true,
    // sparse: true, // Important for optional unique fields
    default: '',  // Set default to an empty string
  },
  stripeFee: {
    type: Number,
    default: 0
  },
  netAmount: {
    type: Number,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ["unpaid", "failled", "paid"],
    default: 'unpaid'
  },
  status: {
    type: String,
    enum: ['processing', 'shipped', 'delivered', 'cancelled'],
    default: 'processing'
  },
  deliveryAt: {
    type: Date,
  },
}, {
  timestamps: true,
  versionKey: false
})
      
const OrderModel = model<IOrder>('Order', orderSchema);
export default OrderModel;
      