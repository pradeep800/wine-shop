import { getOrCreateCustomer } from "@/lib/customers";
import { decodeJWT } from "@/lib/decodeJWT";
import { runAsync, validateUser } from "@/lib/helper";
import { stripe } from "@/lib/stripe";
import { NextApiResponse } from "next";
import Stripe from "stripe";
import { MyApiRequest } from "@/pages/api/wallet";
/*
 * Get and create all subscription
 */
async function Subscription(req: MyApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return await handlePost(req, res);
  } else {
    return await handleGet(req, res);
  }
}
async function handleGet(req: MyApiRequest, res: NextApiResponse) {
  const uid = validateUser(req).uid as string;
  let customer = await getOrCreateCustomer(uid);
  const list = stripe.subscriptions.list({ customer: customer.id });
  return (await list).data;
}
async function handlePost(req: MyApiRequest, res: NextApiResponse) {
  const uid = validateUser(req).uid as string;
  let { payment_method, amount }: { payment_method: string; amount: number } =
    req.body;
  const plan = process.env.product_id;
  let customer = await getOrCreateCustomer(uid);
  if (req.body.method === "GET") {
    let allSub = await stripe.subscriptions.list();
    return allSub;
  } else {
    try {
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ plan, quantity: amount }],

        expand: ["latest_invoice.payment_intent"],
        default_payment_method: payment_method,
      });
      return subscription;
    } catch (err) {
      console.log(err);
      return res.status(500).send("server error");
    }
  }
}
export default decodeJWT(runAsync(Subscription));
