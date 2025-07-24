import express, { NextFunction, Request, Response } from 'express';
import ProductController from './Product.controller';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { createProductValidationSchema, updateProductValidationSchema } from './Product.validation';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import upload from '../../helper/upload';

const router = express.Router();

router.post(
  '/create-product',
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  upload.array("image", 4),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validationMiddleware(createProductValidationSchema),
  ProductController.createProduct,
);

router.get(
  '/get-single-product/:productId',
  ProductController.getSingleProduct,
);

router.patch(
  '/update-product/:productId',
  validationMiddleware(updateProductValidationSchema),
  ProductController.updateProduct,
);

router.delete(
  '/delete-product/:productId',
  ProductController.deleteProduct,
);

router.get(
  '/get-products',
  ProductController.getProducts,
);

const ProductRoutes = router;
export default ProductRoutes;
