import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { createColorService, getSingleColorService, getAllColorsService, updateColorService, deleteColorService, getColorDropDownService } from './Color.service';

const createColor = catchAsync(async (req, res) => {
  const result = await createColorService(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Color is created successfully',
    data: result,
  });
});

const getSingleColor = catchAsync(async (req, res) => {
  const { colorId } = req.params;
  const result = await getSingleColorService(colorId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Color is retrieved successfully',
    data: result,
  });
});

const getAllColors = catchAsync(async (req, res) => {
  const result = await getAllColorsService(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Colors are retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});


const getColorDropDown = catchAsync(async (req, res) => {
  const result = await getColorDropDownService();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Colors are retrieved successfully",
    data: result
  });
});

const updateColor = catchAsync(async (req, res) => {
  const { colorId } = req.params;
  const result = await updateColorService(colorId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Color is updated successfully',
    data: result,
  });
});

const deleteColor = catchAsync(async (req, res) => {
  const { colorId } = req.params;
  const result = await deleteColorService(colorId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Color is deleted successfully',
    data: result,
  });
});

const ColorController = {
  createColor,
  getSingleColor,
  getAllColors,
  getColorDropDown,
  updateColor,
  deleteColor,
};
export default ColorController;
