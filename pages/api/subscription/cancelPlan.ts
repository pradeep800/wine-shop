import { getOrCreateCustomer } from "@/lib/customers";
import { decodeJWT } from "@/lib/decodeJWT";
import { runAsync, validateUser } from "@/lib/helper";
import { stripe } from "@/lib/stripe";
import { NextApiResponse } from "next";
import { MyApiRequest } from "../wallet";
/*
 * for Canceling subscription plan
 */
async function HandleCancelPlan(req: MyApiRequest, res: NextApiResponse) {
  const subscription = await stripe.subscriptions.del(req.body.subscriptionId);
  if (subscription.status === "canceled") {
    return subscription;
  } else {
    res.status(505).send("unable to cancel");
  }
}
export default decodeJWT(runAsync(HandleCancelPlan));
