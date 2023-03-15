import { getOrCreateCustomer } from "@/lib/customers";
import { decodeJWT } from "@/lib/decodeJWT";
import { runAsync, validateUser } from "@/lib/helper";
import { stripe } from "@/lib/stripe";
import { NextApiResponse } from "next";
import Stripe from "stripe";
import { MyApiRequest } from "../wallet";
//For Getting subscription and all payment history
async function Success(req: MyApiRequest, res: NextApiResponse) {
  const user = validateUser(req);
  const { start_after } = req.body;
  ///create or get customer detail
  let customer = await getOrCreateCustomer(user.uid);
  let params: Stripe.PaymentIntentListParams = {
    customer: customer.id,
  };

  if (start_after) {
    params.starting_after = start_after;
  }
  try {
    //get 10 payment history
    const allPaymentPromise = stripe.paymentIntents.list(params);
    ///get subscription
    const allSubscriptionPromise = stripe.subscriptions.list({
      customer: customer.id,
    });
    let data = await Promise.all([allPaymentPromise, allSubscriptionPromise]);
    let payments: Stripe.PaymentIntent[] = [],
      subscriptionData: Stripe.Subscription[] = [];
    let has_more: boolean = false; //just for get rid of error
    //check if url contain /v1/payment_intents that means it is payment_intent
    if (data[0].url === "/v1/payment_intents") {
      payments = data[0].data;
      has_more = data[0].has_more;
    } else {
      subscriptionData = data[1].data;
    }
    if (data[1].url === "/v1/subscriptions") {
      subscriptionData = data[1].data as Stripe.Subscription[];
    } else {
      payments = data[0].data;
      has_more = data[0].has_more;
    }
    let successfulPayments: any[] = [];
    //traverse through successful payment and get their card detail
    let cardsPromise: Promise<Stripe.Response<Stripe.PaymentMethod>>[] = [];
    for (const payment of payments) {
      if (payment.status === "succeeded") {
        cardsPromise.push(
          stripe.paymentMethods.retrieve(payment.payment_method as string)
        );
      }
    }
    let cards = await Promise.all(cardsPromise);
    let i = 0;
    //Go through all cards and add them to successful payments
    for (const payment of payments) {
      if (payment.status === "succeeded") {
        successfulPayments.push({
          amount: payment.amount,
          ...cards[i],
          created: payment.created,
        });
        i++;
      }
    }
    let result = {
      payments: successfulPayments ?? [],
      subscription:
        JSON.stringify(subscriptionData) !== "[]"
          ? subscriptionData[0]
          : undefined,
      start_after: payments[payments.length - 1]?.id,
      has_more: has_more as boolean,
    };
    return result;
  } catch (err) {
    console.log(err);
    res.status(505).send("server error");
  }
}
export default decodeJWT(runAsync(Success));
