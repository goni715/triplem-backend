import express from 'express';
import CartController from './Cart.controller';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { createCartValidationSchema, updateCartValidationSchema } from './Cart.validation';

const router = express.Router();

router.post(
  '/create-cart',
  //validationMiddleware(createCartValidationSchema),
  CartController.createCart,
);

router.get(
  '/get-single-cart/:cartId',
  CartController.getSingleCart,
);

router.patch(
  '/update-cart/:cartId',
  validationMiddleware(updateCartValidationSchema),
  CartController.updateCart,
);

router.delete(
  '/delete-cart/:cartId',
  CartController.deleteCart,
);

router.get(
  '/get-all-carts',
  CartController.getAllCarts,
);

const CartRoutes = router;
export default CartRoutes;
