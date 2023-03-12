import { getOrCreateCustomer } from "@/lib/customers";
import { decodeJWT } from "@/lib/decodeJWT";
import { runAsync, validateUser } from "@/lib/helper";
import { stripe } from "@/lib/stripe";
import { NextApiResponse } from "next";
import { MyApiRequest } from "../wallet";

async function Success(req: MyApiRequest, res: NextApiResponse) {
  const user = validateUser(req);
  let customer = await getOrCreateCustomer(user.uid);
  const successfulPayment = await stripe.paymentIntents.list({
    customer: customer.id,
  });
  const subscriptionPayment = await stripe.subscriptions.list({
    customer: customer.id,
  });

  return {
    payment: successfulPayment.data ?? [],
    subscription: subscriptionPayment.data ?? [],
  };
}
export default decodeJWT(runAsync(Success));
