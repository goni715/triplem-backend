import express from 'express';
import ShippingController from './Shipping.controller';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { createShippingValidationSchema, updateShippingValidationSchema } from './Shipping.validation';

const router = express.Router();

router.post(
  '/create-shipping',
  validationMiddleware(createShippingValidationSchema),
  ShippingController.createShipping,
);

router.get(
  '/get-single-shipping/:shippingId',
  ShippingController.getSingleShipping,
);

router.patch(
  '/update-shipping/:shippingId',
  validationMiddleware(updateShippingValidationSchema),
  ShippingController.updateShipping,
);

router.delete(
  '/delete-shipping/:shippingId',
  ShippingController.deleteShipping,
);

router.get(
  '/get-all-shippings',
  ShippingController.getAllShippings,
);

const ShippingRoutes = router;
export default ShippingRoutes;
