import express, { NextFunction, Request, Response } from 'express';
import ProductController from './Product.controller';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { createProductValidationSchema, updateProductValidationSchema } from './Product.validation';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import upload from '../../helper/upload';
import parseJsonDataMiddleware from '../../middlewares/parseJsonDataMiddleware';

const router = express.Router();

router.post(
  '/create-product',
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  upload.array("image", 4),
  ProductController.createProduct,
);

router.get(
  '/get-single-product/:productId',
  ProductController.getSingleProduct,
);

router.patch(
  '/update-product/:productId',
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  validationMiddleware(updateProductValidationSchema),
  ProductController.updateProduct,
);

router.patch(
  '/update-product-img/:productId',
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  upload.array("image", 4),
  ProductController.updateProductImg,
);

router.delete(
  '/delete-product/:productId',
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  ProductController.deleteProduct,
);

router.get(
  '/get-user-products',
  AuthMiddleware(UserRole.user),
  ProductController.getUserProducts,
);
router.get(
  '/get-products',
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  ProductController.getProducts,
);

const ProductRoutes = router;
export default ProductRoutes;
