import { model, Schema } from "mongoose";
import { ISize } from "./Size.interface";


const sizeSchema = new Schema<ISize>({
    size: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
}, {
    versionKey: false
})



const SizeModel = model<ISize>("Size", sizeSchema);
export default SizeModel;