
import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import PaymentController from './Payment.controller';

const router = express.Router();

router.post('/create-checkout-session', AuthMiddleware('user'), PaymentController.createCheckoutSession);

const PaymentRoutes = router;

export default PaymentRoutes;