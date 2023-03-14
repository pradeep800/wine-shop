import AuthCheck from "@/components/authCheck";
import EmptyHistory from "@/components/emptyHistory";
import Loading from "@/components/loading";
import { FetchFromAPI } from "@/lib/helper";
import { FormEvent, Suspense, useEffect, useRef, useState } from "react";
import Stripe from "stripe";
import useSWR, { mutate, useSWRConfig } from "swr";
import payments from "../api/payments";
import { CardInfo } from "../subscription";
interface Subscription {
  quantity: number;
  id: string;
  customer: string;
  items: {
    data: [{ id: string }];
  };
}
interface PaymentHistory {
  card: CardInfo;
  amount: number;
  created: number;
}
interface FetchInterface {
  payments: PaymentHistory[];
  subscription: Subscription;
  start_after: string;
  has_more?: string;
}
/*
 * For initial fetching
 */
const fetcher = async (url: string) => {
  let { payments, subscription, start_after, has_more } = await FetchFromAPI(
    url,
    {
      method: "GET",
    }
  );
  return { payments, subscription, start_after, has_more };
};

export default function AuthKart() {
  return (
    <AuthCheck>
      <History />
    </AuthCheck>
  );
}
/*
 * Use for Pagination
 */
const fetchMore = async (start_after: string) => {
  let {
    payments,
    start_after: sf,
    has_more,
    subscription,
  } = await FetchFromAPI("payments/success", {
    body: {
      start_after,
    },
  });

  return {
    payments,
    start_after: sf,
    subscription,
    has_more,
  } as FetchInterface;
};
function History() {
  const [hasMore, setHasMore] = useState<string>();
  const [subscription, setSubscription] = useState<Subscription>();
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>();
  const [startAfter, setStartAfter] = useState<string>();
  const [openEdit, setOpenEdit] = useState(false);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [allLoading, setAllLoading] = useState(true);
  /*
   * For fetching initial detail like subscription, payment history and card details
   */
  useEffect(() => {
    (async () => {
      const {
        subscription: subscription,
        payments,
        start_after,
        has_more,
      } = await fetcher("/payments/success");

      setSubscription(subscription);
      setPaymentHistory(payments);
      setStartAfter(start_after);
      setAllLoading(false);
      setHasMore(has_more);
    })();
  }, []);
  /*
   * For Canceling subscription
   */
  async function cancel() {
    await FetchFromAPI("subscription/cancelPlan", {
      body: {
        subscriptionId: subscription?.id as string,
      },
    });
    setSubscription(undefined);
    alert("Cancel Successful");
  }
  /*
   * for Saving subscription update that mean number of wine
   */
  const saveUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await FetchFromAPI("subscription/updatePlan", {
        method: "POST",
        body: {
          plan: subscription?.id as string,
          id: subscription?.items.data[0].id,
          amount: parseInt(input),
        },
      });
      setOpenEdit(false);
      let { subscription: sub } = await FetchFromAPI("payments/success", {
        method: "GET",
      });
      setSubscription(sub);

      alert("Update successful");
    } catch (err) {
      alert("Unable to update");
    }
  };
  // Show this Component until everything is fetched
  if (allLoading) {
    return <Loading />;
  }
  //Whenever there is no Payment history and subscription it show no History
  if (JSON.stringify(paymentHistory) === "[]" && !subscription) {
    return <EmptyHistory />;
  }
  return (
    <div className="min-h-[80vh]">
      <div>
        {subscription && (
          <div className=" flex flex-col justify-center items-center  ">
            <div className="border-2 px-3 py-4 mt-3 md:w-[100%] bmd:mx-2 w-[800px] ">
              <h1 className="text-center text-2xl pb-3">subscription</h1>
              <div className="flex justify-center pb-3 font-thin">
                <span className="px-2 font-bold">{subscription.quantity}</span>{" "}
                Bottle Of Wine Every Month
              </div>
              <div className="flex justify-around">
                <span
                  className="p-2 bg-green-400 hover:bg-green-300 rounded"
                  onClick={() => {
                    if (openEdit) {
                      setOpenEdit(false);
                      return;
                    }
                    setOpenEdit(true);
                  }}
                >
                  edit
                </span>
                <span
                  className="bg-red-400 p-2 rounded hover:bg-red-300"
                  onClick={() => {
                    let really = confirm(
                      "Do you Really want to cancel This subscription?"
                    );
                    if (really) {
                      cancel();
                    }
                  }}
                >
                  delete
                </span>
              </div>
              {openEdit && (
                <form
                  onSubmit={saveUpdate}
                  className="flex justify-center mt-3 "
                >
                  <input
                    className="border-2 rounded p-2 w-[100%] max-w-[200px]"
                    type={"number"}
                    defaultValue={subscription.quantity}
                    onChange={(e) => {
                      setInput(e.target.value);
                    }}
                  />
                  <button className="bg-slate-400 hover:bg-slate-300 p-2 rounded  ml-3">
                    update
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
      {JSON.stringify(paymentHistory) !== "[]" && (
        <>
          <div className="flex flex-col ">
            <h1 className="text-2xl pt-7 pb-2 text-center">Payment History</h1>
            <div className="overflow-x-auto w-[calc(100%)] flex flex-col items-center bmd:block  ">
              <table className="table-fix border-2 w-[800px]  border-collapse  ">
                <thead className="">
                  <tr className="table-row bg-slate-300">
                    <th className="border-2 px-4 py-2">S.N.</th>

                    <th className="border-2 px-4 py-2">{"amount(rupee)"}</th>
                    <th className="border-2 px-4 py-2">Date</th>
                    <th className="border-2 px-4 py-2">Card No</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory?.map((payment, index) => {
                    return (
                      <tr key={index} className="table-row hover:bg-slate-100 ">
                        <td className="border-2 px-4 py-2">{index + 1}</td>
                        <td className="border-2 px-4 py-2">
                          {payment.amount / 100}
                        </td>
                        <td className="border-2 px-4 py-2">
                          {
                            new Date(payment.created * 1000)
                              .toString()
                              .match(
                                /(\d{1,2} \d{4} \d{1,2}:\d{1,2}:\d{1,2})/
                              )?.[0]
                          }
                        </td>
                        <td className="border-2 p-2">
                          {CreditCardToken({ card: payment.card })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          {hasMore && (
            <div className="flex justify-around pt-3">
              <div
                onClick={async () => {
                  if (!loading) {
                    setLoading(true);
                    const { payments, start_after, has_more }: FetchInterface =
                      await fetchMore(startAfter as string);

                    setPaymentHistory([
                      ...(paymentHistory as PaymentHistory[]),
                      ...payments,
                    ]);
                    setStartAfter(start_after);
                    setHasMore(has_more);
                    setLoading(false);
                  }
                }}
                className={`bg-green-400 p-2 w-[200px] text-center rounded ${
                  !loading && "hover:bg-green-300"
                } `}
              >
                {loading ? "Loading..." : "Load More"}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
function CreditCardToken({ card }: { card: CardInfo }) {
  const { last4, brand, exp_month, exp_year } = card;

  return `${brand} **** **** **** ${last4} expires ${exp_month}/${exp_year}`;
}