import AuthCheck from "@/components/authCheck";

export default function Cart() {
  let amount = 10;
  let date = "20-3-30";
  let card = "*** *** *** *** ***";
  return (
    <AuthCheck>
      <div className="flex  h-[80vh] flex-col items-center">
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
      </div>
    </AuthCheck>
  );
}
