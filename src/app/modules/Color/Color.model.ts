import { Schema, model } from 'mongoose';
import { IColor } from './Color.interface';
      
const colorSchema = new Schema<IColor>({
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
      
const ColorModel = model<IColor>('Color', colorSchema);
export default ColorModel;
      