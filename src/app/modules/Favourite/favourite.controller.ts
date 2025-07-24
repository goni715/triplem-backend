import catchAsync from "../../utils/catchAsync";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";
import { FavoriteValidFields } from "./favourite.constant";
import { addOrRemoveFavouriteService, getFavouriteIdsService, getFavouriteListService } from "./favourite.service";

const addOrRemoveFavourite = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const { productId } = req.body;
  const result = await addOrRemoveFavouriteService(loginUserId as string, productId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message as string,
    data: result.data,
  });
});
  
  
  
const getFavouriteList = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const validatedQuery = pickValidFields(req.query, FavoriteValidFields);
    const result = await getFavouriteListService(loginUserId as string, validatedQuery);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Favourite products are retrieved successfully",
      meta: result.meta,
      data: result.data
    });
});


const getFavouriteIds = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await getFavouriteIdsService(loginUserId as string);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Favourite Ids are retrieved successfully",
      data: result
    });
});


const FavouriteController = {
   addOrRemoveFavourite,
   getFavouriteList,
   getFavouriteIds
}

export default FavouriteController;