import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { updateShippingService, getShippingAddressService } from './Shipping.service';


const getShippingAddress = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await getShippingAddressService(loginUserId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Shipping Address is retrieved successfully',
    data: result,
  });
});



const updateShipping = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await updateShippingService(loginUserId as string, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Shipping Address is updated successfully',
    data: result,
  });
});


const ShippingController = {
  getShippingAddress,
  updateShipping,
};
export default ShippingController;
