import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const createCheckoutSession = catchAsync(async (req, res) => {
  const result = await createCheckoutSessionServiceService(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Checkout session is created successfully',
    data: result,
  });
});

const PaymentController = {
  createCheckoutSession
};
export default PaymentController;