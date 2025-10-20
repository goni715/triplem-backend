import ApiError from '../../errors/ApiError';
import { OrderSearchableFields } from './Order.constant';
import { IOrder, TOrderQuery, TUserOrderQuery } from './Order.interface';
import OrderModel from './Order.model';
import { makeFilterQuery, makeSearchQuery } from '../../helper/QueryBuilder';
import CartModel from '../Cart/Cart.model';
import ObjectId from '../../utils/ObjectId';
import mongoose, { Types } from "mongoose";
import generateTransactionId from '../../utils/generateTransactionId';
import Stripe from 'stripe';
import config from '../../config';
import isValidYearFormat from '../../utils/isValidateYearFormat';
import ProductModel from '../Product/Product.model';
import { ICartPayload } from '../Cart/Cart.interface';
import sendDeliveredEmail from '../../utils/sendDeliveredEmail';
import sendProcessingEmail from '../../utils/sendProcessingEmail';
import sendShippedEmail from '../../utils/sendShippedEmail';
import sendCancelledEmail from '../../utils/sendCancelledEmail';

const stripe = new Stripe(config.stripe_secret_key as string);


const createOrderWithStripeService = async (
  loginUserId: string,
  userEmail: string
) => {


  const carts = await CartModel.aggregate([
    {
      $match: {
        userId: new ObjectId(loginUserId)
      }
    },
    {
      $project: {
        _id:0,
        userId: 0,
        createdAt:0,
        updatedAt:0
      }
    }
  ]);

  if(carts?.length===0){
    throw new ApiError(404, "No items in cart.")
  }
  
  //count totalPrice
  const totalPrice = carts?.reduce((total, currentValue)=>total+ (currentValue.price*currentValue.quantity), 0);
  const cartProducts = carts?.map((cv) => ({
    ...cv,
    total: Number(cv.price) * Number(cv.quantity)
  }))

  
  const lineItems = cartProducts?.map((product) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: product.name,
      },
      unit_amount: product.price * 100, // price in cents
    },
    quantity: product.quantity,
  }));

  //cartProducts for metadata
  const cartProductsForMetaData = carts?.map((cv)=> ({
    productId:cv.productId,
    quantity: cv.quantity
  }))

   //generate token
  const token = Math.floor(100000 + Math.random() * 900000);

  //generate transactionId
  const transactionId = generateTransactionId();
  

     //transaction & rollback
    const session = await mongoose.startSession();
  
    try {
      session.startTransaction();
  
      //delete from cart list
      await CartModel.deleteMany(
        { userId: new ObjectId(loginUserId) },
        { session }
      );
  
      const order = await OrderModel.create([
        {
          userId: loginUserId,
          token,
          products: cartProducts,
          totalPrice,
          transactionId
        }
      ], {session});
      
      //create payment session
        const paymentSession = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: lineItems,
          mode: "payment",
          metadata: {
            orderId: (order[0]._id).toString(),
            userId: loginUserId,
            cartProducts: JSON.stringify(cartProductsForMetaData)
          },
          customer_email: userEmail,
          client_reference_id: (order[0]._id).toString(),
          success_url: `${config.frontend_url}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${config.frontend_url}/cancel`,
        });
  
      //transaction success
      await session.commitTransaction();
      await session.endSession();
      return {
        url: paymentSession.url
      };
    } catch (err: any) {
      await session.abortTransaction();
      await session.endSession();
      throw new Error(err);
    }

};


const getUserOrdersService = async (loginUserId: string, query: TUserOrderQuery) => {
  const {
    searchTerm, 
    page = 1, 
    limit = 10, 
    sortOrder = "desc",
    sortBy = "createdAt", 
    ...filters  // Any additional filters
  } = query;

  // 2. Set up pagination
  const skip = (Number(page) - 1) * Number(limit);

  //3. setup sorting
  const sortDirection = sortOrder === "asc" ? 1 : -1;


  const result = await OrderModel.aggregate([
    {
      $match: {
        userId: new ObjectId(loginUserId)
      }
    },
    { $unwind: "$products" },
    {
      $lookup: {
        from: "colors",
        localField: "products.colorId",
        foreignField: "_id",
        as: "products.color"
      }
    },
    {
      $unwind: {
        path: "$products.color",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "reviews",
        let: {
          productId: "$products.productId",
          orderId: "$_id",
          userId: new ObjectId(loginUserId),
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$productId", "$$productId"] },
                  { $eq: ["$orderId", "$$orderId"] },
                  { $eq: ["$userId", "$$userId"] },
                ],
              },
            },
          },
        ],
        as: "products.reviews",
      },
    },
    {
      $addFields: {
        "products.isReview": {
          $cond: {
            if: { $gt: [{ $size: "$products.reviews" }, 0] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        token: { $first: "$token" },
        userId: { $first: "$userId" },
        totalPrice: { $first: "$totalPrice" },
        stripeFee: { $first: "$stripeFee" },
        netAmount: { $first: "$netAmount" },
        paymentStatus: { $first: "$paymentStatus" },
        status: { $first: "$status" },
        deliveryAt: { $first: "$deliveryAt" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
        products: { $push: "$products" }
      }
    },
    {
      $project: {
        _id: 1,
        token: 1,
        totalPrice: 1,
        stripeFee:1,
        netAmount:1,
        paymentStatus: 1,
        status: 1,
        deliveryAt: 1,
        createdAt: 1,
        products: {
          $map: {
            input: "$products",
            as: "product",
            in: {
              productId: "$$product.productId",
              name: "$$product.name",
              price: "$$product.price",
              quantity: "$$product.quantity",
              total: "$$product.total",
              image: "$$product.image",
              size: "$$product.size",
              colorName: "$$product.color.name",
              colorHexCode: "$$product.color.hexCode",
              isReview: "$$product.isReview"
            }
          }
        }
      }
    },
    { $sort: { [sortBy]: sortDirection } },
    { $skip: skip },
    { $limit: Number(limit) },
  ]);

  // total count
  const totalCountResult = await OrderModel.aggregate([
     {
      $match: {
        userId: new ObjectId(loginUserId)
      }
    },
    { $count: "totalCount" }
  ])

  const totalCount = totalCountResult[0]?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / Number(limit));

return {
  meta: {
    page: Number(page), //currentPage
    limit: Number(limit),
    totalPages,
    total: totalCount,
  },
  data: result,
};
};


const getAllOrdersService = async (query: TOrderQuery) => {
  const {
    searchTerm, 
    page = 1, 
    limit = 10, 
    sortOrder = "desc",
    sortBy = "createdAt", 
    ...filters  // Any additional filters
  } = query;

  // 2. Set up pagination
  const skip = (Number(page) - 1) * Number(limit);

  //3. setup sorting
  const sortDirection = sortOrder === "asc" ? 1 : -1;

  //4. setup searching
  let searchQuery = {};
  if (searchTerm) {
    searchQuery = makeSearchQuery(searchTerm, OrderSearchableFields);
  }

  //5 setup filters
  let filterQuery = {};
  if (filters) {
    filterQuery = makeFilterQuery(filters);
  }
  const result = await OrderModel.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $unwind: "$user"
    },
    {
      $project: {
        _id: 1,
        token:1,
        fullName: "$user.fullName",
        email: "$user.email",
        phone: "$user.phone",
        paymentId: "$paymentId",
        totalPrice: "$totalPrice",
        stripeFee: "$stripeFee",
        netAmount: "$netAmount",
        status: "$status",
        paymentStatus: "$paymentStatus",
        deliveryAt: "$deliveryAt",
        createdAt: "$createdAt"
      },
    },
    {
      $match: {
        ...searchQuery,
        ...filterQuery
      },
    },
    { $sort: { [sortBy]: sortDirection } }, 
    { $skip: skip }, 
    { $limit: Number(limit) }, 
  ]);

  // total count result
  const totalCountResult = await OrderModel.aggregate([
     {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $unwind: "$user"
    },
    {
      $project: {
        _id: 1,
        token:1,
        fullName: "$user.fullName",
        email: "$user.email",
        phone: "$user.phone",
        status: "$status",
        paymentStatus: "$paymentStatus",
        deliveryAt: "$deliveryAt",
        createdAt: "$createdAt"
      },
    },
    {
      $match: {
        ...searchQuery,
        ...filterQuery
      },
    },
    { $count: "totalCount" }
  ])

  const totalCount = totalCountResult[0]?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / Number(limit));

return {
  meta: {
    page: Number(page), //currentPage
    limit: Number(limit),
    totalPages,
    total: totalCount,
  },
  data: result,
};
};

const getSingleOrderService = async (orderId: string) => {
  if (!Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "orderId must be a valid ObjectId")
  }

  const result = await OrderModel.aggregate([
    {
      $match: {
        _id: new ObjectId(orderId)
      }
    },
    { $unwind: "$products" },
    {
      $lookup: {
        from: "colors",
        localField: "products.colorId",
        foreignField: "_id",
        as: "products.color"
      }
    },
    {
      $unwind: {
        path: "$products.color",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: "$_id",
        token: { $first: "$token" },
        userId: { $first: "$userId" },
        totalPrice: { $first: "$totalPrice" },
        stripeFee: { $first: "$stripeFee" },
        netAmount: { $first: "$netAmount" },
        paymentStatus: { $first: "$paymentStatus" },
        status: { $first: "$status" },
        deliveryAt: { $first: "$deliveryAt" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
        products: { $push: "$products" }
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $unwind: "$user"
    },
    {
      $lookup: {
        from: "shippings",
        localField: "userId",
        foreignField: "userId",
        as: "shipping"
      }
    },
    {
      $unwind: "$shipping"
    },
    {
      $project: {
        _id: 1,
        token:1,
        customerName: "$user.fullName",
        customerEmail: "$user.email",
        customerPhone: "$user.phone",
        shipping: {
          "streetAddress": "$shipping.streetAddress",
          "city": "$shipping.city",
          "state": "$shipping.state",
          "zipCode": "$shipping.zipCode"
        },
        totalPrice: 1,
        stripeFee:1,
        netAmount:1,
        paymentStatus: 1,
        status: 1,
        deliveryAt: 1,
        createdAt: 1,
        products: {
          $map: {
            input: "$products",
            as: "product",
            in: {
              productId: "$$product.productId",
              name: "$$product.name",
              price: "$$product.price",
              quantity: "$$product.quantity",
              total: "$$product.total",
              image: "$$product.image",
              size: "$$product.size",
              colorName: "$$product.color.name",
              colorHexCode: "$$product.color.hexCode"
            }
          }
        }
      }
    },
  ]);


  if (result.length===0) {
    throw new ApiError(404, 'orderId Not Found');
  }

  return result[0];
};

const updateOrderService = async (orderId: string, payload: Partial<IOrder>) => {
  if (!Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "orderId must be a valid ObjectId")
  }

  const order = await OrderModel.aggregate([
    {
      $match: {
        _id: new ObjectId(orderId)
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $project: {
        _id: 1,
        token: 1,
        customerName: "$user.fullName",
        customerEmail: "$user.email",
        total: "$totalPrice",
        paymentId: 1,
        paymentStatus: 1,
        status: 1,
        deliveryAt: 1,
        products: 1,
        createdAt: "$createdAt",
      }
    },
  ]);


  if (order.length === 0) {
    throw new ApiError(404, "orderId not found");
  }

  //if status==="delivered"
  if (payload.status === "delivered") {
    if (order[0].paymentStatus !== "paid") {
      throw new ApiError(403, "This order has not been paid for yet.")
    }
    payload.deliveryAt = new Date()
  }


  const result = await OrderModel.updateOne(
    { _id: orderId },
    payload,
  );


  if (payload.status === "delivered") {
    await sendDeliveredEmail(order[0].customerEmail, order[0])
    return;
  }
  if (payload.status === "processing") {
    await sendProcessingEmail(order[0].customerEmail, order[0])
    return;
  }

  if (payload.status === "shipped") {
    await sendShippedEmail(order[0].customerEmail, order[0])
    return;
  }

  if (payload.status === "cancelled") {
    await sendCancelledEmail(order[0].customerEmail, order[0])
    return;
  }

  return result;
};

const deleteOrderService = async (orderId: string) => {
  const order = await OrderModel.findById(orderId);
  if(!order){
    throw new ApiError(404, "Order Not Found");
  }
  const result = await OrderModel.deleteOne({ _id:orderId });
  return result;
};


const verifySessionService = async (sessionId: string) => {
  if (!sessionId) {
    throw new ApiError(400, "sessionId is required");
  }

    const paymentSession = await stripe.checkout.sessions.retrieve(sessionId);
    //payment_status = "no_payment_required", "paid", "unpaid"
    if (paymentSession.payment_status !== "paid") {
      throw new ApiError(403, "Payment Failled");
    }

    const metadata = paymentSession?.metadata;
    if(!metadata || !paymentSession?.payment_intent){
      throw new ApiError(400, "Invalid Session Id")
    }
    
    const order = await OrderModel.findOne({
      _id: metadata.orderId,
      userId: metadata.userId,
      paymentStatus: "paid"
    });

    if (order) {
      throw new ApiError(400, "Payment already completed");
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentSession?.payment_intent as string);
    const charge = await stripe.charges.retrieve(
      paymentIntent.latest_charge as string
    );
    const balanceTx = await stripe.balanceTransactions.retrieve(
      charge.balance_transaction as string
    );

    const netAmount = balanceTx?.net / 100
    const stripeFee = balanceTx.fee / 100

    const cartProducts = JSON.parse(metadata?.cartProducts);

 
  //transaction & rollback
  const session = await mongoose.startSession();

  try {
    //start transaction
    session.startTransaction();

    // update product sales in bulk
    //bulkWrite send one request to MongoDB:
    await ProductModel.bulkWrite(
      cartProducts.map((item: ICartPayload) => ({
        updateOne: {
          filter: { _id: item.productId },
          update: [
            {
              $set: {
                quantity: {
                  $max: [
                    { $subtract: ["$quantity", item.quantity] }, //quantity can't be negative, but 0
                    0
                  ]
                }
              }
            }
          ],
        }
      })),
      { session }
    );


    //update payment status
    const result = await OrderModel.updateOne({
      _id: metadata.orderId,
      userId: metadata.userId,
    }, {
      paymentStatus: "paid",
      paymentId: paymentSession?.payment_intent,
      stripeFee,
      netAmount
    }, {
      session
    })

    //transaction success
    await session.commitTransaction();
    await session.endSession();
    return result;
  }catch (err:any) {
      await session.abortTransaction();
      await session.endSession();
      throw new Error(err);
  }
};


const getIncomeOverviewService = async (year: string) => {
  if(!isValidYearFormat(year)){
    throw new ApiError(400, "Invalid year, year should be in 'YYYY' format.")
  }

  const start = `${year}-01-01T00:00:00.000+00:00`;
  const end = `${year}-12-31T00:00:00.000+00:00`;

  const result = await OrderModel.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(start), $lte: new Date(end) },
        paymentStatus: "paid"
      }
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        income: { $sum: "$totalPrice" },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
    {
      $addFields: {
        month: {
          $arrayElemAt: [
            [
              "",
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
            "$_id.month",
          ],
        },
      },
    },
    {
      $project: {
        _id:0
      }
    }
  ])

  // Fill in missing months
  const allMonths = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const filledData = allMonths.map((month) => {
    const found = result?.find((item) => item.month === month);
    return {
      month,
      income: found ? found.income : 0
    };
  });
 
  return filledData;
}

export {
  createOrderWithStripeService,
  getUserOrdersService,
  getAllOrdersService,
  getSingleOrderService,
  updateOrderService,
  deleteOrderService,
  verifySessionService,
  getIncomeOverviewService
};
