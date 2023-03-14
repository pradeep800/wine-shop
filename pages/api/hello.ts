import { db } from "@/lib/firestore-sdk";
import { runAsync } from "@/lib/helper";

async function handle() {
  let a = await db.collection("users").get();
  return { a };
}
export default runAsync(handle);
