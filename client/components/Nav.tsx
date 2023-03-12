import { auth, db } from "@/lib/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect } from "react";
import { useStore } from "@/lib/store";
import kart from "@/static/images/kart.png";
import Image from "next/image";
import Link from "next/link";
import { useUserData } from "@/lib/useUserData";
export function Nav() {
  const userInfo = useUserData();
  async function SignOut() {
    await signOut(auth);
  }
  async function SignInClick() {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
    const { displayName, uid, email, photoURL } = user;
    let info = await getDoc(doc(collection(db, "users"), uid));
    if (!info.exists()) {
      await setDoc(
        doc(collection(db, "users"), uid),
        {
          displayName,
          uid,
          email,
          photoURL,
        },
        { merge: true }
      );
    }
  }
  return (
    <nav className="">
      <div className="flex items-center   ">
        <Link href={"/"}>
          <div className="text-2xl font-bold">Wine</div>
        </Link>

        {userInfo?.uid ? (
          <div className="ml-auto flex gap-4 shrink-0">
            <Link href="/profile">
              <Image
                src={userInfo.photoURL as string}
                alt="my photo"
                width={40}
                height={40}
                className="rounded "
                title={userInfo.displayName as string}
              />
            </Link>

            <button
              className=" border-slate-500 border-2 border-solid rounded p-2 hover:bg-slate-400"
              onClick={SignOut}
            >
              Logout
            </button>
            <Link href="/kart" className="shrink-0">
              <Image src={kart} alt="kart" width={40} height={40} />
            </Link>
          </div>
        ) : (
          <div
            onClick={SignInClick}
            className="ml-auto p-2 border-black border-2 hover:bg-slate-200  rounded   "
          >
            Login
          </div>
        )}
      </div>
    </nav>
  );
}
