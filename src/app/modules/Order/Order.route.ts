import express from 'express';
import OrderController from './Order.controller';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { createOrderValidationSchema, updateOrderValidationSchema } from './Order.validation';
import AuthMiddleware from '../../middlewares/AuthMiddleware';

const router = express.Router();

router.post(
  '/create-order',
  AuthMiddleware("user"),
  //validationMiddleware(createOrderValidationSchema),
  OrderController.createOrder,
);

router.get(
  '/get-single-order/:orderId',
  OrderController.getSingleOrder,
);

router.patch(
  '/update-order/:orderId',
  validationMiddleware(updateOrderValidationSchema),
  OrderController.updateOrder,
);

router.delete(
  '/delete-order/:orderId',
  OrderController.deleteOrder,
);

router.get(
  '/get-all-orders',
  OrderController.getAllOrders,
);

const OrderRoutes = router;
export default OrderRoutes;
