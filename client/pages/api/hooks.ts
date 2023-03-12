import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import getRawBody from "raw-body";
type WebhookHandlers = {
  "checkout.session.completed": (data: Stripe.Event.Data) => Promise<void>;
  "payment_intent.succeeded": (data: Stripe.PaymentIntent) => Promise<void>;
  "payment_intent.payment_failed": (
    data: Stripe.PaymentIntent
  ) => Promise<void>;
  "customer.subscription.deleted": (data: Stripe.Subscription) => Promise<void>;
  "customer.subscription.created": (data: Stripe.Subscription) => Promise<void>;
  "invoice.payment_succeeded": (data: Stripe.Invoice) => Promise<void>;
  "invoice.payment_failed": (data: Stripe.Invoice) => Promise<void>;
};
const webhookHandlers: WebhookHandlers = {
  "checkout.session.completed": async (data: Stripe.Event.Data) => {
    console.log("checkout.session.completed");
  },
  "payment_intent.succeeded": async (data: Stripe.PaymentIntent) => {
    console.log("payment_intent.succeeded");
  },
  "payment_intent.payment_failed": async (data: Stripe.PaymentIntent) => {
    console.log("payment_intent.payment_failed");
  },
  "customer.subscription.deleted": async (data: Stripe.Subscription) => {
    console.log("customer.subscription.deleted");
  },
  "customer.subscription.created": async (data: Stripe.Subscription) => {
    console.log("customer.subscription.created");
  },
  "invoice.payment_succeeded": async (data: Stripe.Invoice) => {
    console.log("invoice.payment_succeeded");
  },
  "invoice.payment_failed": async (data: Stripe.Invoice) => {
    console.log("invoice.payment_failed");
  },
};

export default async function handleStripeWebhook(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const rawBody = await getRawBody(req);
  const signature = req.headers["stripe-signature"] as string;
  const event = stripe.webhooks.constructEvent(
    rawBody,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET as string
  );
  try {
    await webhookHandlers[event.type as keyof WebhookHandlers](
      event.data.object as any
    );
    res.send({ received: true });
  } catch (error: any) {
    console.log(error);
    res.status(400).send("Webhook Error: " + error.message);
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
