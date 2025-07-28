import express from 'express';
import ShippingController from './Shipping.controller';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { createShippingValidationSchema } from './Shipping.validation';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';

const router = express.Router();

router.get(
  '/get-shipping-address',
  AuthMiddleware(UserRole.user),
  ShippingController.getShippingAddress,
);

router.patch(
  '/create-update-shipping',
  AuthMiddleware(UserRole.user),
  validationMiddleware(createShippingValidationSchema),
  ShippingController.updateShipping,
);


const ShippingRoutes = router;
export default ShippingRoutes;
