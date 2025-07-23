import catchAsync from "../../utils/catchAsync";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";
import { DiningValidFields } from "./Size.constant";
import { createSizeService, deleteSizeService, getDiningListService, getSizeDropDownService, updateSizeService } from "./Size.service";


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



const getDiningList = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const validatedQuery = pickValidFields(req.query, DiningValidFields);
  const result = await getDiningListService(loginUserId as string, validatedQuery);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Dinings are retrived successfully",
    meta: result.meta,
    data: result.data
  });
});

const getSizeDropDown = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await getSizeDropDownService(loginUserId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Dinings are retrived successfully",
    data: result
  });
});


const updateSize = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const { diningId } = req.params;
  const { name } = req.body;
  const result = await updateSizeService(loginUserId as string, diningId, name);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Size is updated successfully",
    data: result
  });
});


const deleteSize = catchAsync(async (req, res) => {
  const { diningId } = req.params;
  const result = await deleteSizeService(diningId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Size is deleted successfully",
    data: result
  });
});


const SizeController = {
  createSize,
  getDiningList,
  getSizeDropDown,
  updateSize,
  deleteSize
}

export default SizeController;