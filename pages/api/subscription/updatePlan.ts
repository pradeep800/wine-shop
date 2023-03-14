import { decodeJWT } from "@/lib/decodeJWT";
import { runAsync } from "@/lib/helper";
import { MyApiRequest } from "../wallet";
import { NextApiResponse } from "next";
import { stripe } from "@/lib/stripe";
async function HandleUpdatePlan(req: MyApiRequest, res: NextApiResponse) {
  let subscription;
  try {
    subscription = await stripe.subscriptions.update(req.body.plan, {
      proration_behavior: "none",

      items: [
        {
          price: process.env.product_id,
          id: req.body.id,
          quantity: req.body.amount,
        },
      ],
    });
  } catch (err) {
    console.log(err);
  }

  return subscription;
}
export default decodeJWT(runAsync(HandleUpdatePlan));
