import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./firestore";
import { useStore } from "./store";
export interface User {
  displayName: string;
  email: string;
  photoURL: string;
  stripeCustomerId: string;
  uid: string;
}
/*
 * For fetching user Info
 */
export function useUserData() {
  const [user] = useAuthState(auth);
  const setUserInfo = useStore((state) => state.setUserInfo);
  const userInfo = useStore((state) => state.userInfo);
  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe;

    if (user) {
      const ref = doc(db, `users/${user.uid}`);
      unsubscribe = onSnapshot(ref, (snapshot) => {
        if (snapshot.exists()) {
          setUserInfo(snapshot.data() as User);
        } else {
          setUserInfo(null);
        }
      });
    } else {
      setUserInfo(null);
    }

    return unsubscribe;
  }, [user]);

  return userInfo;
}
