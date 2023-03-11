import { decodeJWT } from "@/lib/decodeJWT";
import { db } from "@/lib/firestore-sdk";
import { runAsync } from "@/lib/helper";
import { stripe } from "@/lib/stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { MyApiRequest } from "./wallet";
async function MakeDefaultCard(req: MyApiRequest, res: NextApiResponse) {
  const { cardId } = req.body;
  let uid = req.currentUser.uid;
  let data = (await db.collection("users").doc(uid).get()).data();
  if (data?.stripeCustomerId) {
    await stripe.customers.update(data.stripeCustomerId, {
      invoice_settings: {
        default_payment_method: cardId,
      },
    });
  }
}
export default decodeJWT(runAsync(MakeDefaultCard));
