import { getOrCreateCustomer } from "@/lib/customers";
import { decodeJWT } from "@/lib/decodeJWT";
import { runAsync, validateUser } from "@/lib/helper";
import { stripe } from "@/lib/stripe";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { MyApiRequest } from "@/pages/api/wallet";

async function Subscription(req: MyApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return await handlePost(req, res);
  } else {
    return await handleGet(req, res);
  }
}
async function handleGet(req: MyApiRequest, res: NextApiResponse) {
  const uid = validateUser(req).uid as string;
  let customer = getOrCreateCustomer(uid);
  const list = stripe.subscriptions.list();
  return (await list).data;
}
async function handlePost(req: MyApiRequest, res: NextApiResponse) {
  const uid = validateUser(req).uid as string;
  let { payment_method, amount }: { payment_method: string; amount: number } =
    req.body;
  const plan = process.env.product_id;
  console.log(plan);
  try {
    let customer = await getOrCreateCustomer(uid);
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ plan, quantity: amount }],

      expand: ["latest_invoice.payment_intent"],
      default_payment_method: payment_method,
    });
    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const payment_intent = invoice.payment_intent as Stripe.PaymentIntent;
    return subscription;
  } catch (err) {
    console.log(err);
  }
  return { message: "some error" };
}
export default decodeJWT(runAsync(Subscription));
