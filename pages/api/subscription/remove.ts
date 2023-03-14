import { getOrCreateCustomer } from "@/lib/customers";
import { decodeJWT } from "@/lib/decodeJWT";
import { runAsync, validateUser } from "@/lib/helper";
import { stripe } from "@/lib/stripe";
import { NextApiResponse } from "next";
import { MyApiRequest } from "../wallet";
/*
 * remove all subscription which have incomplete status
 */
async function Remove(req: MyApiRequest, res: NextApiResponse) {
  let uid = validateUser(req).uid;
  let customerId = (await getOrCreateCustomer(uid)).id;
  let subscriptions;
  try {
    subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "incomplete",
      limit: 100,
    });
    for (const subscription of subscriptions.data) {
      await stripe.subscriptions.del(subscription.id);
    }
    return { status: "complete" };
  } catch (err) {
    console.log(err);
  }
  return { status: "not complete" };
}
export default decodeJWT(runAsync(Remove));
