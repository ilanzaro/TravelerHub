import { supabase } from "@/lib/supabase";
import type { Session, User } from "@supabase/supabase-js";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
import { create } from "zustand";
import { useChatStore } from "./chatStore";
import { useProfileStore } from "./profilesStore";

type AuthState = {
  session: Session | null;
  user: User | null;
  initialized: boolean;

  fetchSession: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInGoogleVerify: () => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  initialized: false,

  fetchSession: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    set({
      session,
      user: session?.user ?? null,
      initialized: true,
    });
  },

  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    await useAuthStore.getState().fetchSession();
  },

  signOut: async () => {
    await supabase.auth.signOut();
    useProfileStore.getState().reset();
    useChatStore.getState().reset();
    set({ session: null, user: null });
  },
  signInGoogleVerify: async () => {
    const redirectTo = Linking.createURL("/");

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    //auth listener will update the user state
    if (error) throw error;

    if (Platform.OS !== "web" && data?.url) {
      await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    }
    return;
  },
}));
