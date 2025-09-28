import Stripe from "stripe";
import config from "../../config";
import ApiError from "../../errors/ApiError";

const stripe = new Stripe(config.stripe_secret_key as string);

const createCheckoutSessionService = async (payload: any) => {
  const lineItems = [
    {
      price_data: {
        currency: "sgd",
        product_data: {
          name: "Basic T-Shirt",
        },
        unit_amount: 2000, // $20.00
      },
      quantity: 2,
    },
    {
      price_data: {
        currency: "sgd",
        product_data: {
          name: "Coffee Mug",
        },
        unit_amount: 1500, // $15.00
      },
      quantity: 1,
    },
    {
      price_data: {
        currency: "sgd",
        product_data: {
          name: "Wireless Mouse",
        },
        unit_amount: 3500, // $35.00
      },
      quantity: 1,
    },
  ];

  const FRONTEND_URL = "https://triplem-website-integration.vercel.app";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["paynow"],
    line_items: lineItems,
    mode: "payment",
    metadata: {
      userId: "userId",
    },
    customer_email: "goniosman715149123@gmail.com",
    success_url: `${"https://triplem-website-integration.vercel.app"}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${FRONTEND_URL}/cancel`,
  });

  return session;
};

const verifyCheckoutService = async (sessionId: string) => {
  if (!sessionId) {
    throw new ApiError(400, "sessionId is required");
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    //payment_status = "no_payment_required", "paid", "unpaid"
    if (session.payment_status !== "paid") {
      throw new ApiError(403, "Payment Failled");
    }
    //update database base on metadata = session.metadata
    return session;
  } catch (err:any) {
    throw new Error(err)
  }
};



const createPaynowPaymentService = async (payload: any) => {
  const { amount, currency } = payload;

  // Create Payment Intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount, // in cents, e.g., $10 = 1000
    currency: currency || 'usd',
    payment_method_types: ['paynow'],
  });


  return {
    paymentIntentId: paymentIntent.id,          // 🔹 Save this in your DB!
    clientSecret: paymentIntent.client_secret,  // For frontend confirmation if needed
    qrCodeUrl : (paymentIntent.next_action as any)?.display_qr_code?.image_url
  }
}

export { createCheckoutSessionService, verifyCheckoutService, createPaynowPaymentService };
