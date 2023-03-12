import { FetchFromAPI } from "@/lib/helper";
import { useStore } from "@/lib/store";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Suspense, useState } from "react";
import Stripe from "stripe";
import { StripeCardElement } from "@stripe/stripe-js";
import { FormEvent } from "react";
import useSWR from "swr";
import Loading from "./loading";
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
export default function ListCreditCard() {
  /*
   * Using suspense for showing loading screen until everything load
   */
  return (
    <Suspense fallback={<Loading />}>
      <CreditCards />
    </Suspense>
  );
}
function CreditCards() {
  /*
   * Get all CreditCards and put it and wallet
   */
  const { data } = useSWR(
    ["wallet", { method: "GET" }],
    (args) => {
      const [url, opts] = args;
      return FetchFromAPI(url, opts);
    },
    { suspense: true }
  );

  const stripe = useStripe();
  const elements = useElements();
  const user = useStore((state) => state.userInfo);
  const [setupIntent, setSetupIntent] = useState<
    Stripe.SetupIntent | undefined
  >();
  const [wallet, setWallet] = useState<AllCardInfo[]>(data);

  /*
   * For getting all the card which are attach to this account
   */
  const getWallet = async () => {
    if (user) {
      const cards: AllCardInfo[] = await FetchFromAPI("wallet", {
        method: "GET",
      });
      setWallet(cards);
    }
  };
  /*
   * Create Setup intent
   */
  const createSetupIntent = async () => {
    const si = (await FetchFromAPI("wallet", {})) as Stripe.SetupIntent;
    setSetupIntent(si);
  };
  /*
   * Submit Handler the submission of card details
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cardElement = elements?.getElement(CardElement) as StripeCardElement;
    if (stripe) {
      const { setupIntent: updatedSetupIntent, error } =
        await stripe.confirmCardSetup(setupIntent?.client_secret as string, {
          payment_method: { card: cardElement },
        });
      if (error) {
        alert(error.message);
        console.log(error);
      } else {
        setSetupIntent(updatedSetupIntent as Stripe.SetupIntent);
        await getWallet();
        alert("success! card Added");
        cardElement.clear();
        setSetupIntent(undefined);
      }
    } else {
      alert("refresh the page");
    }
  };

  return (
    <div className="w-[100%] flex justify-center h-[80vh] items-center">
      <div className="max-w-[700px]  flex justify-center flex-col items-center">
        <div className=" flex justify-center flex-col items-center border-2 p-8 sm:p-1 sm:py-8">
          {wallet.length ? (
            <div className="pb-8">
              <h2 className="text-center pb-2">All Your Cards</h2>
              <select className="border-solid border-2 p-2 rounded-md  ">
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
            </div>
          ) : null}

          <button
            className={` bg-slate-400 ${
              !!!setupIntent && "hover:bg-slate-300"
            } rounded py-1 px-1 ${wallet.length ? "mb-5" : "mb-2"}`}
            disabled={!!setupIntent}
            onClick={createSetupIntent}
            type="submit"
          >
            Attach new Credit Card
          </button>
          <form
            onSubmit={handleSubmit}
            hidden={!setupIntent || setupIntent.status === "succeeded"}
          >
            <div className="sm:w-[300px] w-[400px] pb-3">
              <CardElement />
            </div>

            <div className="text-center">
              <button
                className="bg-slate-400 hover:bg-slate-300 px-3 py-1 rounded"
                type="submit"
              >
                Attach
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
/*
 * Creating option for selection
 */
function CreditCardToken({ card, id }: { card: CardInfo; id: string }) {
  const { last4, brand, exp_month, exp_year } = card;

  return (
    <option id={id} className=" ">
      {brand} **** **** **** {last4} expires {exp_month}/{exp_year}
    </option>
  );
}
