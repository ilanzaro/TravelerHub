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
};

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  initialized: false,

  signInWithEmail: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    set({ session: data.session, user: data.user });
  },

  signUpWithEmail: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    set({ session: data.session, user: data.user });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    useProfileStore.getState().reset();
    useChatStore.getState().reset();
    set({ session: null, user: null });
  },
}));
