import { decodeJWT } from "@/lib/decodeJWT";
import { runAsync } from "@/lib/helper";
import { NextApiResponse } from "next";
import { MyApiRequest } from "../wallet";

export default function handleDeletePlan(
  req: MyApiRequest,
  res: NextApiResponse
) {
  return {
    name: "pradeep",
  };
}
// export default decodeJWT(runAsync(handleDeletePlan));
