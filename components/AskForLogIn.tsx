/*
 *  WhenEver anyone try to access a page which want google authentication it will show this page
 */
export default function AskForLogIn() {
  return (
    <div className="h-[80vh] w-[100%] flex justify-center items-center text-xl text-blue-600 text-center">
      <div>Please Login For Accessing This Page</div>
    </div>
  );
}
