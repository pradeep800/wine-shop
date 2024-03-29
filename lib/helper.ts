import { auth } from "./firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { MyApiRequest } from "@/pages/api/wallet";
import { User } from "firebase/auth";

/*
 * For fetching from api folder
 */
export async function FetchFromAPI(
  endpointURL: string,
  opts: {
    method?: string;
    body?: {
      amount?: number;
      payment_method?: string;
      id?: string;
      customer?: string;
      plan?: string;
      subscriptionId?: string;
      start_after?: string;
    };
  }
) {
  const { method, body } = { method: "POST", body: null, ...opts };
  const user = auth.currentUser;
  const token = user && (await user.getIdToken());
  const res = await fetch(`./api/${endpointURL}`, {
    method,
    ...((body as { [key: string]: string | number } | null) && {
      body: JSON.stringify(body),
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.ok) {
    return res.json();
  } else {
    throw Error("unable to process request");
  }
}

/*
 * Whenever there is error in our api folder it will send "Server Error" message with 505 status
 */
export function runAsync(callback: Function) {
  return async (req: MyApiRequest | NextApiRequest, res: NextApiResponse) => {
    try {
      let a = await callback(req, res);
      res.send(a);
    } catch (err) {
      res.status(500).send("Server Error");
    }
  };
}

/*
 * For validating and Adding currentUser in req
 */
export function validateUser(req: MyApiRequest) {
  const user = req["currentUser"];
  if (!user) {
    throw new Error("you must bo logged in to make this request.");
  }
  return user as User;
}
