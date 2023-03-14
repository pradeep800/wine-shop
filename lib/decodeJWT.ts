import { MyApiRequest } from "@/pages/api/wallet";
import { NextApiHandler, NextApiResponse } from "next";
import { auth } from "./firestore-sdk";
/*
 * For Decoding Jwt Token of firebase
 */
export function decodeJWT(handler: NextApiHandler) {
  return async (req: MyApiRequest, res: NextApiResponse) => {
    if (req.headers.authorization?.startsWith("Bearer ")) {
      const idToken = req.headers.authorization.split("Bearer ")[1];
      try {
        const decodeToken = await auth.verifyIdToken(idToken);
        req["currentUser"] = decodeToken;
        return handler(req, res);
      } catch (err) {
        res.status(500).send({ message: "something went Wrong" });
        console.log(err);
      }
    }
  };
}
