import express from 'express';
import OrderController from './Order.controller';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { updateOrderValidationSchema } from './Order.validation';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';

const router = express.Router();

router.post(
  '/create-order',
  AuthMiddleware("user"),
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
  '/get-user-orders',
  AuthMiddleware(UserRole.user),
  OrderController.getUserOrders,
);
router.get(
  '/get-all-orders',
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  OrderController.getAllOrders,
);

const OrderRoutes = router;
export default OrderRoutes;
