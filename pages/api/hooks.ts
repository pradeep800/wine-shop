import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import getRawBody from "raw-body";
import { db } from "@/lib/firestore-sdk";
import { DocumentData } from "firebase/firestore";
import { FetchFromAPI } from "@/lib/helper";
export interface User {
  displayName: string;
  email: string;
  photoURL: string;
  stripeCustomerId: string;
  subscriptionStatus: string;
  uid: string;
}
type WebhookHandlers = {
  "customer.subscription.deleted": (data: Stripe.Subscription) => Promise<void>;
  "customer.subscription.created": (data: Stripe.Subscription) => Promise<void>;
  "invoice.payment_failed": (data: Stripe.Invoice) => Promise<void>;
};
/*
 * webhook for delete and create and failed invoice
 */
const webhookHandlers: WebhookHandlers = {
  "customer.subscription.deleted": async (data: Stripe.Subscription) => {
    const customer = (await stripe.customers.retrieve(
      data.customer as string
    )) as Stripe.Customer;
    await db.collection("users").doc(customer.metadata.firebaseUID).update({
      subscriptionStatus: "none",
    });
  },
  "customer.subscription.created": async (data: Stripe.Subscription) => {
    const customer = (await stripe.customers.retrieve(
      data.customer as string
    )) as Stripe.Customer;
    await db.collection("users").doc(customer.metadata.firebaseUID).update({
      subscriptionStatus: "Active",
    });
  },

  "invoice.payment_failed": async (data: Stripe.Invoice) => {
    const customer = (await stripe.customers.retrieve(
      data.customer as string
    )) as Stripe.Customer;
    const snapShot = await db
      .collection("users")
      .doc(customer.metadata.firebaseUID)
      .get();
    const snapShotData = snapShot.data() as User;

    let subscription = (
      await stripe.subscriptions.list({
        customer: snapShotData.stripeCustomerId,
      })
    ).data[0];

    if (subscription.status === "active") {
      await snapShot.ref.update({ subscriptionStatus: "PAST_DUE" });
    } else {
      await FetchFromAPI("subscription/cancelPlan", {
        body: { subscriptionId: subscription.id },
      });
    }
  },
};

export default async function handleStripeWebhook(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const rawBody = await getRawBody(req);
  const signature = req.headers["stripe-signature"] as string;
  try {
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    await webhookHandlers[event.type as keyof WebhookHandlers](
      event.data.object as any
    );
    res.send({ received: true });
  } catch (error: any) {
    console.log(error);
    res.status(500).send("Webhook Error: " + error.message);
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
