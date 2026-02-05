// store/userStore.ts
import { create } from 'zustand';

interface User {
    id?: string;
    name?: string;
    email?: string;
    avatar?: string;
    worksStatus?: string;
}

interface UserStore {
    user: User | null;
    setUser: (user: User | null) => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
    user: null,
    setUser: (user) => set(() => ({ user}))
}));