/*
 *  WhenEver anyone try to access a page which does not exit
 */
export default function PageDoesNotExist() {
  return (
    <div className="h-[80vh] w-[100%] flex justify-center items-center text-xl text-blue-600 text-center">
      <div>Page Does Not Exist</div>
    </div>
  );
}
