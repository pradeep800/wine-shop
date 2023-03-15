import { FetchFromAPI } from "@/lib/helper";
import { useStore } from "@/lib/store";
import { useStripe } from "@stripe/react-stripe-js";
import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import useSWR, { useSWRConfig } from "swr";
import AuthCheck from "@/components/authCheck";
import Loading from "@/components/loading";
import Link from "next/link";
import EditSubscription from "@/components/editSubscription";
import { useRouter } from "next/router";
export interface CardInfo {
  last4: string;
  brand: string;
  exp_month: string;
  exp_year: string;
}
interface AllCardInfo {
  card: CardInfo;
  id: string;
}
interface SubInfo {
  id: string;
  object: {
    [key: string]: [value: string];
  };
}
export default function Subscription() {
  return (
    <AuthCheck>
      <Suspense fallback={<Loading />}>
        <SubscriptionHandler />
      </Suspense>
    </AuthCheck>
  );
}
let fetcher = async () => {
  const subscription = await FetchFromAPI("subscription", {
    method: "GET",
  });
  let wallet = [];
  if (subscription.length === 0) {
    wallet = await FetchFromAPI("wallet", { method: "GET" });
  }
  return { subscription, wallet } as {
    subscription: SubInfo[];
    wallet: AllCardInfo[];
  };
};

function SubscriptionHandler() {
  const { data } = useSWR<{ subscription: SubInfo[]; wallet: AllCardInfo[] }>(
    "data",
    fetcher,
    { suspense: true }
  );

  const { subscription, wallet } = data || {};
  const { mutate } = useSWRConfig();
  const amount = useStore((state) => state.amount);
  const [selectedCard, setSelectedCard] = useState<string | null>(
    wallet.length ? wallet[0].id : null
  );
  const user = useStore((state) => state.userInfo);

  const stripe = useStripe();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    return () => {
      mutate(
        (key) => true, // which cache keys are updated
        undefined, // update cache data to `undefined`
        { revalidate: false } // do not revalidate
      );
    };
  }, [user]);
  async function subToSubscription() {
    setLoading(true);
    try {
      let subObj = await FetchFromAPI("subscription", {
        method: "POST",
        body: { amount, payment_method: selectedCard as string },
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
              alert("Successfully Subscribed!");
              router.push("/");
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
  if (subscription.length !== 0) {
    return <EditSubscription />;
  }
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
        {wallet.length ? (
          <>
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
              className={`bg-slate-400 ${
                !loading && "hover:bg-slate-300"
              } px-4 py-2 rounded`}
              disabled={loading}
              onClick={subToSubscription}
            >
              {loading ? "loading..." : "Pay"}
            </button>
          </>
        ) : (
          <Link
            href="/profile"
            className="bg-slate-400 hover:bg-slate-300 p-2 rounded"
          >
            Add Card
          </Link>
        )}
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
