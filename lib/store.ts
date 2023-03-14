import { create } from "zustand";
import { User } from "./useUserData";
/*
 * For State Management
 */
interface StoreInfo {
  amount: number;
  userInfo: null | User;
  setUserInfo: (userInfo: User | null) => void;
  setAmount: (newAmount: number) => void;
}
const store = (set: any): StoreInfo => ({
  amount: 1, //for amount of wine
  userInfo: null, //for user info
  setUserInfo: (info) => {
    //for setting user info
    set((state: StoreInfo) => ({
      userInfo: info,
    }));
  },

  setAmount: (newAmount) => {
    //for setting amount of wine
    if (newAmount >= 1) {
      set((state: StoreInfo) => ({ amount: newAmount }));
    }
  },
});
export const useStore = create<StoreInfo>(store);
