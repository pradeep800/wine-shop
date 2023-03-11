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
    // Add your business logic here
  },
  "payment_intent.succeeded": async (data: Stripe.PaymentIntent) => {
    // Add your business logic here
  },
  "payment_intent.payment_failed": async (data: Stripe.PaymentIntent) => {
    // Add your business logic here
  },
  "customer.subscription.deleted": async (data: Stripe.Subscription) => {
    //add business logic
  },
  "customer.subscription.created": async (data: Stripe.Subscription) => {
    //add business logic here
  },
  "invoice.payment_succeeded": async (data: Stripe.Invoice) => {
    // Add your business logic here
  },
  "invoice.payment_failed": async (data: Stripe.Invoice) => {
    //add your business logic here
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
