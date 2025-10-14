import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createCheckoutSessionService, createGooglePaymentService, createPaynowPaymentService, verifyCheckoutService } from "./Payment.service";

const createCheckoutSession = catchAsync(async (req, res) => {
  const result = await createCheckoutSessionService(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Checkout session is created successfully',
    data: result,
  });
});


const verifyCheckout = catchAsync(async (req, res) => {
  const { sessionId } = req.query;
  const result = await verifyCheckoutService(sessionId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment Successful',
    data: result,
  });
});


const createPaynowPayment = catchAsync(async (req, res) => {
  const result = await createPaynowPaymentService(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Create PayNow Payment',
    data: result,
  });
});


const createGooglePaymentIntent = catchAsync(async (req, res) => {
  const result = await createGooglePaymentService(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Google Payment Intent is initiated',
    data: result,
  });
});


const PaymentController = {
  createCheckoutSession,
  verifyCheckout,
  createPaynowPayment,
  createGooglePaymentIntent
};
export default PaymentController;