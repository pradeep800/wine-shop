import { auth } from "@/lib/firestore";
import { useRouter } from "next/router";
import React from "react";
import { useStore } from "@/lib/store";
import AskForLogIn from "./AskForLogIn";
export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const userInfo = useStore((state) => state.userInfo);
  const router = useRouter();

  return userInfo ? <>{children}</> : <AskForLogIn />;
}
