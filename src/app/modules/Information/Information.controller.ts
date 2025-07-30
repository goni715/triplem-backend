import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { createInformationService } from './Information.service';

const createInformation = catchAsync(async (req, res) => {
  const result = await createInformationService(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Information is updated successfully',
    data: result,
  });
});





const InformationController = {
  createInformation
};
export default InformationController;
