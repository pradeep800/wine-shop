import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
/*
 * Public config keys
 */
const firebaseConfig = {
  apiKey: "AIzaSyABvG36NBU7J5puMCfSLnPp6NJ0pRBvwmE",
  authDomain: "wineshop-cc8a2.firebaseapp.com",
  projectId: "wineshop-cc8a2",
  storageBucket: "wineshop-cc8a2.appspot.com",
  messagingSenderId: "335411147095",
  appId: "1:335411147095:web:cde2b5cfe1740043058e12",
  measurementId: "G-GN9WF1WXYJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
