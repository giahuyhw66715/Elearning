import { create } from "zustand";
import { IUser } from "../types";

type State = {
    user: IUser | null;
};

type Action = {
    setUser: (user: State["user"]) => void;
};

const useUserStore = create<State & Action>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
}));

export default useUserStore;
