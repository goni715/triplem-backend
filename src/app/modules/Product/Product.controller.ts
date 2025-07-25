import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { getSingleProductService, updateProductService, deleteProductService, getProductsService, updateProductImgService, getUserProductsService, createProductService } from './Product.service';

const createProduct = catchAsync(async (req, res) => {
  const result = await createProductService(req, req.body);

 return sendResponse(res, {
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

const getUserProducts = catchAsync(async (req, res) => {
  const result = await getUserProductsService(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Products are retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});
const getProducts = catchAsync(async (req, res) => {
  const result = await getProductsService(req.query);

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
  const result = await updateProductService(req, productId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product is updated successfully',
    data: result,
  });
});
const updateProductImg = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await updateProductImgService(req, productId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Product's image is updated successfully`,
    data: result,
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await deleteProductService(productId);

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
  getUserProducts,
  getProducts,
  updateProduct,
  updateProductImg,
  deleteProduct,
};
export default ProductController;
