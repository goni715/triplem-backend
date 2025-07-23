import slugify from "slugify";
import ApiError from "../../errors/ApiError";
import CategoryModel from "./Category.model";



const createCategoryService = async (loginUserId:string, size: string) => {
    const slug = slugify(size).toLowerCase();
    
    //check size is already existed
    const existingSize = await CategoryModel.findOne({
        slug
    });

    if(existingSize){
        throw new ApiError(409, 'This size is already existed');
    }

    const result = await CategoryModel.create({
         size,
         slug
    })
    return result;
}


const getCategoryDropDownService = async () => {
    const result = await CategoryModel.find().select('-createdAt -updatedAt -slug').sort('-createdAt');
    return result;
}


const updateCategoryService = async (sizeId: string, size: string) => {
    const existingSize = await CategoryModel.findById(sizeId);
    if (!existingSize) {
        throw new ApiError(404, 'This sizeId not found');
    }

    const slug = slugify(size).toLowerCase();
    const sizeExist = await CategoryModel.findOne({
        _id: { $ne: sizeId },
        slug
    })
    if (sizeExist) {
        throw new ApiError(409, 'Sorry! This size is already existed');
    }

    const result = await CategoryModel.updateOne(
        { _id: sizeId },
        {
            size,
            slug
        }
    )

    return result;
}

const deleteCategoryService = async (sizeId: string) => {
    const existingSize = await CategoryModel.findById(sizeId)
    if(!existingSize){
        throw new ApiError(404, 'This sizeId not found');
    }

    //check if diningId is associated with Product
    // const associateWithTable = await TableModel.findOne({
    //      diningId
    // });
    // if(associateWithTable){
    //     throw new ApiError(409, 'Failled to delete, This dining is associated with Table');
    // }

    const result = await CategoryModel.deleteOne({ _id: sizeId})
    return result;
}



export {
    createCategoryService,
    getCategoryDropDownService,
    updateCategoryService,
    deleteCategoryService
}