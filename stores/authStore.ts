import { supabase } from "@/lib/supabase";
import type { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";
import { useChatStore } from "./chatStore";
import { useProfileStore } from "./profilesStore";

type AuthState = {
  session: Session | null;
  user: User | null;
  initialized: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  fetchSession: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  initialized: false,

  fetchSession: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    set({ session, user: session?.user ?? null, initialized: true });
  },

  signInWithEmail: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    await get().fetchSession();
  },

  signUpWithEmail: async (email, password) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    await get().fetchSession();
  },

  signOut: async () => {
    await supabase.auth.signOut();
    useProfileStore.getState().reset();
    useChatStore.getState().reset();
    set({ session: null, user: null });
  },
}));
