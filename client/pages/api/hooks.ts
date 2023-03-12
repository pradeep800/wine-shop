import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import getRawBody from "raw-body";
import { db } from "@/lib/firestore-sdk";
type WebhookHandlers = {
  "customer.subscription.deleted": (data: Stripe.Subscription) => Promise<void>;
  "customer.subscription.created": (data: Stripe.Subscription) => Promise<void>;
  "invoice.payment_failed": (data: Stripe.Invoice) => Promise<void>;
};
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
    await snapShot.ref.update({ subscriptionStatus: "PAST_DUE" });
  },
};

export default async function handleStripeWebhook(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const rawBody = await getRawBody(req);
  const signature = req.headers["stripe-signature"] as string;
  console.log(signature);
  const event = stripe.webhooks.constructEvent(
    rawBody,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET as string
  );
  console.log(event.type);
  try {
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
