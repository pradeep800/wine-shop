import { decodeJWT } from "@/lib/decodeJWT";
import { runAsync } from "@/lib/helper";
import { createPaymentIntent } from "@/lib/stripeHelperFunction";
import { NextApiRequest, NextApiResponse } from "next";
async function Payment(req: NextApiRequest, res: NextApiResponse) {
  let paymentIntent;

  try {
    paymentIntent = await createPaymentIntent(
      req.body.amount,
      req.body.id,
      req.body.customer
    );
  } catch (err) {
    console.log(err);
  }

  return paymentIntent;
}
export default runAsync(decodeJWT(Payment));
