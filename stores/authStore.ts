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

  fetchSession: () => Promise<User | null>;
  signIn: (email: string, password: string) => Promise<void>;
  signInGoogleVerify: () => Promise<User | null>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  initialized: false,

  fetchSession: async (): Promise<User | null> => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    set({
      session,
      user: session?.user ?? null,
      initialized: true,
    });

    return session?.user ?? null;
  },

  signIn: async (email: string, password: string): Promise<void> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    await useAuthStore.getState().fetchSession();
  },

  signInGoogleVerify: async (): Promise<User | null> => {
    const redirectTo = Linking.createURL("auth/callback");

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        skipBrowserRedirect: Platform.OS !== "web",
      },
    });

    if (error) throw error;

    if (Platform.OS !== "web" && data?.url) {
      await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    }

    await supabase.auth.refreshSession();

    return await useAuthStore.getState().fetchSession();
  },

  signOut: async (): Promise<void> => {
    await supabase.auth.signOut();
    useProfileStore.getState().reset();
    useChatStore.getState().reset();

    set({
      session: null,
      user: null as User | null,
    });
  },
}));
