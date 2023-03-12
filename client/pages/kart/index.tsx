import AuthCheck from "@/components/authCheck";
import Loading from "@/components/loading";
import { FetchFromAPI } from "@/lib/helper";
import { Suspense, useState } from "react";
import Stripe from "stripe";
import useSWR from "swr";
interface Subscription {
  quantity: number;
  id: string;
  customer: string;
  items: {
    data: [{ id: string }];
  };
}
interface FetchInterface {
  payments: Stripe.PaymentIntent[];
  subscription: Subscription[];
}
const fetcher = async (url: string) => {
  let { payments, subscription } = await FetchFromAPI(url, { method: "GET" });
  console.log(payments, subscription);
  return { payments, subscription } as FetchInterface;
};
export default function AuthKart() {
  return (
    <AuthCheck>
      <Suspense fallback={<Loading />}>
        <Kart />
      </Suspense>
    </AuthCheck>
  );
}
function Kart() {
  const { data } = useSWR<FetchInterface>("payments/success", fetcher, {
    suspense: true,
  });
  const [input, setInput] = useState<string>("");
  async function cancel() {
    await FetchFromAPI("subscription/cancelPlan", {
      body: {
        subscriptionId: data.subscription[0].id as string,
      },
    });
  }
  return (
    <div>
      <div>{data.subscription[0].quantity}</div>
      <div>Edit</div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          let a = await FetchFromAPI("subscription/updatePlan", {
            method: "POST",
            body: {
              plan: data.subscription[0].id as string,
              id: data.subscription[0].items.data[0].id,
              amount: parseInt(input),
            },
          });
          console.log(a);
        }}
      >
        <input
          className="border-2"
          type={"number"}
          defaultValue={0}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        <button>save</button>
      </form>
      <button onClick={cancel}>Kart</button>
    </div>
  );
  /* <div className="flex  h-[80vh] flex-col items-center">
        <section className="w-[700px] md:w-[400px] border-2 h-min p-3 mt-8">
          <div className="text-center text-2xl">Subscription</div>
          <div className=" ">
            <div className="flex justify-between md:flex-col font-thin">
              <h1>{amount} Bottle Of Wine Every Month</h1>
              <h2>{amount * 500} rupee</h2>
            </div>
            <div className="font-thin">Starting-date: {date}</div>
            <div className="flex justify-around">
              <button className="text-red-500 hover:text-red-400">
                cancel
              </button>
              <button className="text-green-400 hover:text-green-300">
                edit
              </button>
            </div>
          </div>
        </section>
        <section className="w-[700px] md:w-[400px] border-2 h-min p-3 mt-8">
          <h1 className="text-center text-2xl">Payment History</h1>
          <ol>
            <li className="flex justify-between">
              <div>amount</div>
              <div className="ml-[-100px]">date</div>
              <div>card</div>
            </li>
            <li className="flex justify-between">
              <div>{amount} bottle</div>
              <div>{date}</div>
              <div>{card}</div>
            </li>
          </ol>
        </section>
      </div> */
}
