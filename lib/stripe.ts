import Stripe from "stripe";
/*
 * initialization stripe for api folder
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET as string, {
  apiVersion: "2022-11-15",
});
