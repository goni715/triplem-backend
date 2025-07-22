import express from 'express';
import ShippingController from './Shipping.controller';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { createShippingValidationSchema, updateShippingValidationSchema } from './Shipping.validation';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';

const router = express.Router();

router.post(
  '/create-shipping',
  AuthMiddleware(UserRole.user),
  validationMiddleware(createShippingValidationSchema),
  ShippingController.createShipping,
);

router.get(
  '/get-shipping-address',
  AuthMiddleware(UserRole.user),
  ShippingController.getShippingAddress,
);

router.patch(
  '/update-shipping',
  AuthMiddleware(UserRole.user),
  validationMiddleware(updateShippingValidationSchema),
  ShippingController.updateShipping,
);


const ShippingRoutes = router;
export default ShippingRoutes;
