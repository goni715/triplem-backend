import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { createShippingService, updateShippingService, getShippingAddressService } from './Shipping.service';

const createShipping = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await createShippingService(loginUserId as string, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Shipping address is updated successfully',
    data: result,
  });
});

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
  createShipping,
  getShippingAddress,
  updateShipping,
};
export default ShippingController;
