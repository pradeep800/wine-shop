/*
 * Whenever Error Boundary cache error this page is shown
 */
export default function ErrorFallBack() {
  return (
    <div className="h-[100vh] flex justify-center items-center p-3">
      <h1 className="text-slate-600 max-w-[500px] flex flex-col gap-3 text-xl ">
        {`We're sorry, but it seems like there's an internal error on our website.
        If you encounter this error, please try refreshing the page first to see
        if the situation changes. If the error persists, we kindly request that
        you go to our home page and check the footer section for our email
        address.`}
      </h1>
    </div>
  );
}
