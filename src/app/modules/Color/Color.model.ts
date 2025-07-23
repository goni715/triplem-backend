import { Schema, model } from 'mongoose';
import { IColor } from './Color.interface';

const colorSchema = new Schema<IColor>({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  hexCode: {
    type: String,
    required: true,
    match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    trim: true,
    unique: true
  },
}, {
  timestamps: true,
  versionKey: false
})

const ColorModel = model<IColor>('Color', colorSchema);
export default ColorModel;
      