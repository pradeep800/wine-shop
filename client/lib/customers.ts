import { stripe } from "./stripe";

import Stripe from "stripe";
import { db } from "./firestore-sdk";
/**
 * Creates a SetupIntent used to save a credit card for later use
 */
export async function createSetupIntent(userId: string) {
  const customer = await getOrCreateCustomer(userId);
  return stripe.setupIntents.create({
    customer: customer.id,
  });
}

/**
 * Returns all payment sources associated to the user
 */
export async function listPaymentMethods(userId: string) {
  const customer = await getOrCreateCustomer(userId);
  return (
    await stripe.paymentMethods.list({
      customer: customer.id,
      type: "card",
    })
  ).data;
}

/**
 * Gets the existing Stripe customer or creates a new record
 */
export async function getOrCreateCustomer(
  userId: string,
  params?: Stripe.CustomerCreateParams
) {
  const userSnapshot = await db.collection("users").doc(userId).get();
  const { stripeCustomerId, email, displayName } = userSnapshot.data() || {};
  if (!email) {
    throw Error("there is no name");
  }
  // If missing customerID, create it
  if (!stripeCustomerId) {
    // CREATE new customer
    const customer = await stripe.customers.create({
      email: email,
      name: displayName,
      metadata: {
        firebaseUID: userId,
      },
      ...params,
    });
    await userSnapshot.ref.set(
      { stripeCustomerId: customer.id },
      { merge: true }
    );
    console.log(customer, email);
    return customer;
  } else {
    return (await stripe.customers.retrieve(
      stripeCustomerId
    )) as Stripe.Customer;
  }
}
