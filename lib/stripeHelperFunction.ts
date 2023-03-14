import { stripe } from "./stripe";
export async function createPaymentIntent(
  amount: number,
  cardId: string,
  customer: string
) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 500 * 100,
    currency: "inr",
    payment_method: cardId,
    customer,
  });
  return paymentIntent;
}
