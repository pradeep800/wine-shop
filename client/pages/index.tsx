"use client";
import Loading from "@/components/loading";
import { Nav } from "@/components/Nav";
import Wine from "@/components/Wine";
import { auth } from "@/lib/firestore";
import { useStore } from "@/lib/store";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
export default function Home() {
  const [error, setError] = useState(false);
  const userInfo = useStore((state) => state.userInfo);
  const router = useRouter();
  const { amount, setAmount } = useStore((state) => ({
    amount: state.amount,
    setAmount: state.setAmount,
  }));

  useEffect(() => {
    if (auth.currentUser) {
      setError(false);
    } else {
      setError(true);
    }
  }, [userInfo]);
  function Increment() {
    setAmount(amount + 1);
  }
  function Decrement() {
    setAmount(amount - 1);
  }

  return (
    <>
      <div className="flex md:flex-col  mx-auto mt-10 md:mt-3 p-2 max-w-[800px] gap-4 border-solid border-black border-2 rounded">
        <div>
          <Wine />
        </div>
        <div className="w-[100%]">
          <h1 className="font-medium text-xl text-center w-[100%]">
            Best Tasting Wine
          </h1>
          <div className="mt-14 md:mt-4">
            <h2>Description</h2>
            <p className="font-thin">
              A luxurious and sophisticated beverage made from fermented grapes,
              boasting a complex flavor profile that varies based on the type
              and region of production.
            </p>
          </div>
          <h2 className="text-red-300 text-4xl text-center  mt-14 md:mt-8 ">
            {amount * 500}₹
          </h2>
          <div className="flex justify-center gap-4 text-lg font-bold mt-5  ">
            <button
              className="bg-slate-300 hover:bg-slate-200 px-3 rounded"
              onClick={Decrement}
            >
              -
            </button>
            <div>{amount}</div>
            <button
              className="bg-slate-400 hover:bg-slate-300 px-3 rounded"
              onClick={Increment}
            >
              +
            </button>
          </div>
          <div className="flex justify-around mt-[50px] md:mt-[30px] md:mb-[30px]">
            <Link href="/payment">
              <button className="bg-blue-400 hover:bg-blue-300 px-8 py-3 rounded">
                Pay
              </button>
            </Link>

            <Link href={"/subscription"}>
              <button className="bg-blue-500 hover:bg-blue-400 px-8 py-3 rounded">
                Subscription
              </button>
            </Link>
          </div>
          {error && (
            <div className="text-red-700 mt-8 text-center font-light">
              Please LogIn With Google First
            </div>
          )}
        </div>
      </div>
    </>
  );
}
