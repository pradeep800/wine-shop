import { create } from "zustand";
import { User } from "./useUserData";
interface StoreInfo {
  amount: number;
  userInfo: null | User;
  setUserInfo: (userInfo: User | null) => void;
  setAmount: (newAmount: number) => void;
}
const store = (set: any): StoreInfo => ({
  amount: 1,
  userInfo: null,
  setUserInfo: (info) => {
    set((state: StoreInfo) => ({
      userInfo: info,
    }));
  },
  setAmount: (newAmount) => {
    if (newAmount >= 1) {
      set((state: StoreInfo) => ({ amount: newAmount }));
    }
  },
});
export const useStore = create<StoreInfo>(store);
