import Link from "next/link";
export default function EditSubscription() {
  return (
    <div className=" h-[80vh] flex flex-col gap-4 justify-center items-center">
      <div className="max-w-[400px]">
        You can edit your monthly wine subscription and they will come after
        this month if you want more wine for this month you can buy them by
        payment method.
      </div>
      <Link
        className="bg-slate-400 hover:bg-slate-300 p-3 rounded"
        href="/kart"
      >
        Edit Plan
      </Link>
    </div>
  );
}
