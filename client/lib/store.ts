import { create } from "zustand";
import { User } from "./useUserData";
interface StoreInfo {
  amount: number;
  userInfo: null | User;
  // name: string | null;
  setUserInfo: (userInfo: User | null) => void;
  setAmount: (newAmount: number) => void;
  // setName: (name: string | null) => void;
}
const store = (set: any): StoreInfo => ({
  amount: 1,
  // name: null,
  userInfo: null,
  setUserInfo: (info) => {
    set((state: StoreInfo) => ({
      userInfo: info,
    }));
  },
  // setName: (name) => {
  //   set(() => ({ name: name }));
  // },
  setAmount: (newAmount) => {
    if (newAmount >= 1) {
      set((state: StoreInfo) => ({ amount: newAmount }));
    }
  },
});
export const useStore = create<StoreInfo>(store);
