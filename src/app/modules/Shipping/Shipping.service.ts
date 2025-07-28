import { IShipping } from './Shipping.interface';
import ShippingModel from './Shipping.model';
import ApiError from '../../errors/ApiError';

const createShippingService = async (
  loginUserId: string,
  payload: IShipping,
) => {
  //check shipping information
  const shipping = await ShippingModel.findOne({ userId: loginUserId });

  if (shipping) {
    //throw new ApiError(409, "You have already set shipping information");
    const result = await ShippingModel.updateOne(
      { userId: loginUserId },
      payload,
      { runValidators: true }
    );
    return result;
  }

  const result = await ShippingModel.create({
    ...payload,
    userId: loginUserId
  });

  return result;
};


const getShippingAddressService = async (loginUserId: string,) => {
  const result = await ShippingModel.findOne({ userId: loginUserId }).select("streetAddress state city zipCode -_id");
  if (!result) {
    return {
      "streetAddress": "",
      "city": "",
      "state": "",
      "zipCode": ""
    }
  }
  return result;
};


const updateShippingService = async (loginUserId: string, payload: any) => {
  //check shipping information
  const shipping = await ShippingModel.findOne({ userId: loginUserId });
  if(!shipping){
    throw new ApiError(404, "Shipping not found");
  }
  const result = await ShippingModel.updateOne(
    { userId: loginUserId },
    payload,
    { runValidators: true}
  );

  return result;
};




export {
  createShippingService,
  getShippingAddressService,
  updateShippingService,
};
