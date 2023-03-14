/*
 * When something is loading This component is shown
 */
export default function Loading() {
  return (
    <div className="h-[80vh] flex justify-center items-center">
      <div className=" flex gap-4 ">
        <div className="w-[20px] h-[20px] animate-l1 rounded-full bg-blue-400"></div>
        <div className="w-[20px] h-[20px] animate-l2 rounded-full bg-blue-400"></div>
        <div className="w-[20px] h-[20px] animate-l3 rounded-full bg-blue-400"></div>
      </div>
    </div>
  );
}
