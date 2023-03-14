/*
 * It is use for showing only pages authenticated users
 */
import React from "react";
import { useStore } from "@/lib/store";
import AskForLogIn from "./askForLogIn";
export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const userInfo = useStore((state) => state.userInfo);

  return userInfo ? <>{children}</> : <AskForLogIn />;
}
