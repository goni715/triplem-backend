import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createSizeService, deleteSizeService, getSizeDropDownService, updateSizeService } from "./Size.service";


const createSize = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const { size } = req.body;
  const result = await createSizeService(loginUserId as string, size);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Size is created successfully",
    data: result
  });
});



const getSizeDropDown = catchAsync(async (req, res) => {
  const result = await getSizeDropDownService();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Sizes are retrieved successfully",
    data: result
  });
});


const updateSize = catchAsync(async (req, res) => {
  const { sizeId } = req.params;
  const { size } = req.body;
  const result = await updateSizeService(sizeId, size);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Size is updated successfully",
    data: result
  });
});


const deleteSize = catchAsync(async (req, res) => {
  const { sizeId } = req.params;
  const result = await deleteSizeService(sizeId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Size is deleted successfully",
    data: result
  });
});


const SizeController = {
  createSize,
  getSizeDropDown,
  updateSize,
  deleteSize
}

export default SizeController;