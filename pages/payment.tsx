import { FetchFromAPI } from "@/lib/helper";
import { useStripe } from "@stripe/react-stripe-js";
import { PaymentIntent } from "@stripe/stripe-js";

import useSWR, { useSWRConfig } from "swr";
import { Suspense, useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firestore";
import AuthCheck from "@/components/authCheck";
import Image from "next/image";
import Loading from "@/components/loading";
import Link from "next/link";
import { useRouter } from "next/router";
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
export default function PaymentWithAuth() {
  return (
    <AuthCheck>
      <Suspense fallback={<Loading />}>
        <Payment />
      </Suspense>
    </AuthCheck>
  );
}
function Payment() {
  const { data: wallet } = useSWR<AllCardInfo[]>(
    ["wallet", { method: "GET" }],
    (args: [string, { method: string }]) => {
      const [url, opts] = args;
      return FetchFromAPI(url, opts);
    },
    {
      suspense: true,
    }
  );
  const router = useRouter();
  const { cache } = useSWRConfig();
  const stripe = useStripe();
  const amount = useStore((state) => state.amount);
  const user = useStore((state) => state.userInfo);
  const [cardId, setCardId] = useState<string | null>(
    wallet.length ? wallet[0].id : null
  );
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    return () => {
      cache.delete(["wallet", { method: "GET" }]);
    };
  }, [user]);
  async function CreateIntentAndPay() {
    setLoading(true);
    try {
      if (user?.uid) {
        const userInfoSnapshot = await getDoc(
          doc(collection(db, "users"), user.uid)
        );
        if (userInfoSnapshot.exists()) {
          const userInfo = userInfoSnapshot.data();
          if (userInfo?.stripeCustomerId) {
            const customer = userInfo.stripeCustomerId;
            const intent = await FetchFromAPI("payments", {
              body: { amount: amount, id: cardId as string, customer },
            });
            Pay(intent);
          }
        }
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }

  async function Pay(intent: PaymentIntent) {
    try {
      if (stripe && intent) {
        const { paymentIntent, error } = await stripe.confirmCardPayment(
          intent.client_secret as string
        );

        if (error) {
          console.error(error);
          alert("error: " + error.message);
        } else {
          alert("Successfully Paid");
          router.push("/");
        }
      }
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
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
          Pay {amount * 500} rupee for {amount} bottle of Wine
        </div>
        {wallet.length ? (
          <>
            <select
              className="border-solid border-2 p-2 rounded-md  "
              onChange={(e) => {
                e.preventDefault();

                setCardId(e.target.value);
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
              onClick={CreateIntentAndPay}
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
