import slugify from "slugify";
import ApiError from "../../errors/ApiError";
import SizeModel from "./Size.model";
import ProductModel from "../Product/Product.model";
import ObjectId from "../../utils/ObjectId";



const createSizeService = async (size: string) => {
    const slug = slugify(size).toLowerCase();
    
    //check size is already existed
    const existingSize = await SizeModel.findOne({
        slug
    });

    if(existingSize){
        throw new ApiError(409, 'This size is already existed');
    }

    const result = await SizeModel.create({
         size,
         slug
    })
    return result;
}


const getSizeDropDownService = async () => {
    const result = await SizeModel.find().select('-createdAt -updatedAt -slug').sort('-createdAt');
    return result;
}


const updateSizeService = async (sizeId: string, size: string) => {
    const existingSize = await SizeModel.findById(sizeId);
    if (!existingSize) {
        throw new ApiError(404, 'This sizeId not found');
    }

    const slug = slugify(size).toLowerCase();
    const sizeExist = await SizeModel.findOne({
        _id: { $ne: sizeId },
        slug
    })
    if (sizeExist) {
        throw new ApiError(409, 'Sorry! This size is already existed');
    }

    const result = await SizeModel.updateOne(
        { _id: sizeId },
        {
            size,
            slug
        }
    )

    return result;
}

const deleteSizeService = async (sizeId: string) => {
    const existingSize = await SizeModel.findById(sizeId)
    if(!existingSize){
        throw new ApiError(404, 'This sizeId not found');
    }

    //check if sizeidId is associated with Product
    const associateWithProduct = await ProductModel.findOne({
        sizes: { $in: [new ObjectId(sizeId)] } 
    });
    if(associateWithProduct){
        throw new ApiError(409, 'Failled to delete, This size is associated with Product');
    }

    const result = await SizeModel.deleteOne({ _id: sizeId})
    return result;
}



export {
    createSizeService,
    getSizeDropDownService,
    updateSizeService,
    deleteSizeService
}