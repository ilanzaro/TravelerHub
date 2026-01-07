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
  signInGoogleVerify: () => Promise<User | null>;
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
    console.log("Starting Google OAuth flow...");
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
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectTo
      );
      console.log("OAuth session result:", result);
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      console.warn("No user session found after OAuth");
      return null;
    }

    set({ session, user: session.user });
    return session.user;
  },
}));
