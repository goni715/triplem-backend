import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { createProductService, getSingleProductService, getAllProductsService, updateProductService, deleteProductService } from './Product.service';

const createProduct = catchAsync(async (req, res) => {
  const result = await createProductService(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Product is created successfully',
    data: result,
  });
});

const getSingleProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await getSingleProductService(productId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product is retrieved successfully',
    data: result,
  });
});

const getAllProducts = catchAsync(async (req, res) => {
  const result = await getAllProductsService(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Products are retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await updateProductService(productId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product is updated successfully',
    data: result,
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await deleteProductService(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product is deleted successfully',
    data: result,
  });
});

const ProductController = {
  createProduct,
  getSingleProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
export default ProductController;
