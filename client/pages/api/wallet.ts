import { createSetupIntent, listPaymentMethods } from "@/lib/customers";
import { runAsync, validateUser } from "@/lib/helper";
import { User } from "firebase/auth";
import { decodeJWT } from "@/lib/decodeJWT";
import { NextApiRequest, NextApiResponse } from "next";
export interface MyApiRequest extends NextApiRequest {
  currentUser: {
    uid: string;
  };
}

async function handler(req: MyApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const user: User = validateUser(req);
    const setupIntent = await createSetupIntent(user.uid);
    res.send(setupIntent);
  } else {
    const user = validateUser(req);
    const wallet = await listPaymentMethods(user.uid);
    res.send(wallet);
  }
}
export default decodeJWT(runAsync(handler));
