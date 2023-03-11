import { FetchFromAPI } from "@/lib/helper";
import { useStore } from "@/lib/store";
import { useStripe } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import Stripe from "stripe";
import Image from "next/image";
import AuthCheck from "@/components/authCheck";
interface CardInfo {
  last4: string;
  brand: string;
  exp_month: string;
  exp_year: string;
}
interface AllCardInfo {
  card: CardInfo;
  id: string;
}
function SubscriptionHandler() {
  const amount = useStore((state) => state.amount);
  const [selectedCard, setSelectedCard] = useState<string>();
  const [wallet, setWallet] = useState<AllCardInfo[]>([]);
  const stripe = useStripe();
  const [loading, setLoading] = useState(false);
  const user = useStore((state) => state.userInfo);
  useEffect(() => {
    (async () => {
      await getWallet();
      await getSubscription();
    })();
  }, [user]);
  async function getSubscription() {
    // let a = await FetchFromAPI("subscription", { method: "GET" });
  }
  async function subscription() {
    setLoading(true);
    try {
      let subObj = await FetchFromAPI("subscription", {
        method: "POST",
        body: { amount, payment_method: selectedCard },
      });
      const { latest_invoice } = subObj;
      if (latest_invoice.payment_intent) {
        const { client_secret, status } = latest_invoice.payment_intent;
        if (status === "requires_action") {
          if (stripe !== null) {
            const { error: confirmationError } =
              await stripe.confirmCardPayment(client_secret);
            if (confirmationError) {
              console.error(confirmationError);
              setLoading(false);
              alert("unable to confirm card");
              await FetchFromAPI("subscription/remove", { method: "GET" });
              return;
            } else {
              alert("success");
            }
          } else {
            console.error("Stripe object is null");
            alert("Stripe object is null");
            return;
          }
        }
      }
    } catch (err) {
      setLoading(false);
    }

    setLoading(false);
  }
  const getWallet = async () => {
    const cards: AllCardInfo[] = await FetchFromAPI("wallet", {
      method: "GET",
    });

    setWallet(cards);

    if (cards.length) {
      setSelectedCard(cards[0].id);
    }
  };
  return (
    <div className=" flex h-[80vh] justify-center items-center">
      <div className="flex flex-col justify-center items-center gap-3 border-2 border-black border-solid p-4 sm:p-2 sm:pt-5">
        <Image
          alt="image of product"
          src="/static/images/winePhoto.jpeg"
          height={100}
          width={300}
        />
        <div>
          Pay {amount * 500} rupee for {amount} bottle of Wine Per Month
        </div>
        <select
          className="border-solid border-2 p-2 rounded-md  "
          onChange={(e) => {
            e.preventDefault();

            setSelectedCard(e.target.value);
          }}
        >
          {wallet.map((paymentSource: AllCardInfo, i) => {
            return (
              <CreditCardToken
                key={paymentSource.id}
                id={paymentSource.id}
                card={paymentSource.card as CardInfo}
              />
            );
          })}
        </select>

        <button
          className={`bg-green-400 ${
            !loading && "hover:bg-green-300"
          } px-4 py-2 rounded`}
          disabled={loading}
          onClick={subscription}
        >
          {loading ? "loading..." : "subscription"}
        </button>
      </div>
    </div>
  );
}
function CreditCardToken({ card, id }: { card: CardInfo; id: string }) {
  const { last4, brand, exp_month, exp_year } = card;

  return (
    <option value={id}>
      {brand} **** **** **** {last4} expires {exp_month}/{exp_year}
    </option>
  );
}
export default function Subscription() {
  return (
    <AuthCheck>
      <SubscriptionHandler />
    </AuthCheck>
  );
}
