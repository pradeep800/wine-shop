import { getOrCreateCustomer } from "@/lib/customers";
import { decodeJWT } from "@/lib/decodeJWT";
import { runAsync, validateUser } from "@/lib/helper";
import { stripe } from "@/lib/stripe";
import { NextApiResponse } from "next";
import Stripe from "stripe";
import { MyApiRequest } from "../wallet";

async function Success(req: MyApiRequest, res: NextApiResponse) {
  const user = validateUser(req);
  const { start_after } = req.body;
  let customer = await getOrCreateCustomer(user.uid);
  let params: Stripe.PaymentIntentListParams = {
    customer: customer.id,
  };

  if (start_after) {
    params.starting_after = start_after;
  }
  try {
    const successfulPayment = await stripe.paymentIntents.list(params);

    const subscriptionPayment = await stripe.subscriptions.list({
      customer: customer.id,
    });
    let payments: any[] = [];

    for (const payment of successfulPayment.data) {
      if (payment.status === "succeeded") {
        let card = await stripe.paymentMethods.retrieve(
          payment.payment_method as string
        );

        payments.push({
          amount: payment.amount,
          ...card,
          created: payment.created,
        });
      }
    }
    return {
      payments: payments ?? [],
      subscription: subscriptionPayment.data[0] ?? undefined,
      start_after:
        successfulPayment.data[successfulPayment.data.length - 1]?.id,
      has_more: successfulPayment.has_more,
    };
  } catch (err) {
    console.log(err);
    res.status(505).send("server error");
  }
}
export default decodeJWT(runAsync(Success));
