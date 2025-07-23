import slugify from "slugify";
import ApiError from "../../errors/ApiError";
import CategoryModel from "./Category.model";
import { Types } from "mongoose";



const createCategoryService = async (name: string) => {
    const slug = slugify(name).toLowerCase();
    
    //check category is already existed
    const category = await CategoryModel.findOne({
        slug
    });

    if(category){
        throw new ApiError(409, 'This category is already existed');
    }

    const result = await CategoryModel.create({
         name,
         slug
    })
    return result;
}


const getCategoryDropDownService = async () => {
    const result = await CategoryModel.find().select('-createdAt -updatedAt -slug').sort('-createdAt');
    return result;
}


const updateCategoryService = async (categoryId: string, name: string) => {
    if (!Types.ObjectId.isValid(categoryId)) {
        throw new ApiError(400, "categoryId must be a valid ObjectId")
    }

    const existingCategory = await CategoryModel.findById(categoryId);
    if (!existingCategory) {
        throw new ApiError(404, 'This categoryId not found');
    }

    const slug = slugify(name).toLowerCase();
    const categoryExist = await CategoryModel.findOne({
        _id: { $ne: categoryId },
        slug
    })
    if (categoryExist) {
        throw new ApiError(409, 'Sorry! This category is already existed');
    }

    const result = await CategoryModel.updateOne(
        { _id: categoryId },
        {
            name,
            slug
        }
    )

    return result;
}

const deleteCategoryService = async (categoryId: string) => {
    const category = await CategoryModel.findById(categoryId)
    if(!category){
        throw new ApiError(404, 'This categoryId not found');
    }

    //check if diningId is associated with Product
    // const associateWithTable = await TableModel.findOne({
    //      diningId
    // });
    // if(associateWithTable){
    //     throw new ApiError(409, 'Failled to delete, This dining is associated with Table');
    // }

    const result = await CategoryModel.deleteOne({ _id: categoryId})
    return result;
}



export {
    createCategoryService,
    getCategoryDropDownService,
    updateCategoryService,
    deleteCategoryService
}