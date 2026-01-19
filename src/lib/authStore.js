import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set) => ({
            session: null,
            user: null,
            profile: null,
            setSession: (session) => set({ session, user: session?.user ?? null }),
            setProfile: (profile) => set({ profile }),
            signOut: () => set({ session: null, user: null, profile: null }),
        }),
        {
            name: 'sms-auth-storage',
        }
    )
);

export default useAuthStore;
