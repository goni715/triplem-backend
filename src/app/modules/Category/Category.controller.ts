import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createCategoryService, deleteCategoryService, getCategoryDropDownService, updateCategoryService } from "./Category.service";


const createCategory = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const { size } = req.body;
  const result = await createCategoryService(loginUserId as string, size);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Category is created successfully",
    data: result
  });
});



const getCategoryDropDown = catchAsync(async (req, res) => {
  const result = await getCategoryDropDownService();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Categories are retrieved successfully",
    data: result
  });
});


const updateCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.params;
  const { size } = req.body;
  const result = await updateCategoryService(categoryId, size);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Category is updated successfully",
    data: result
  });
});


const deleteCategory = catchAsync(async (req, res) => {
  const { sizeId } = req.params;
  const result = await deleteCategoryService(sizeId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Category is deleted successfully",
    data: result
  });
});


const CategoryController = {
  createCategory,
  getCategoryDropDown,
  updateCategory,
  deleteCategory
}

export default CategoryController;