import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";
import { useChatStore } from "@/stores/chatStore";
import { useInterestsStore } from "@/stores/interestsStore";
import { usePostsStore } from "@/stores/postsStore";
import { useProfileStore } from "@/stores/profilesStore";
import { useViewersStore } from "@/stores/viewersStore";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Platform } from "react-native";

export function initAuthListener() {
  //Initial session (app launch / reload)
  supabase.auth.getSession().then(({ data }) => {
    useAuthStore.setState({
      session: data.session,
      user: data.session?.user ?? null,
      initialized: true,
    });

    if (data.session?.user) {
      useProfileStore.getState().fetchMyProfile();
    }
  });

  //Auth changes (login / logout / refresh)
  supabase.auth.onAuthStateChange((_event, session) => {
    useAuthStore.setState({
      session,
      user: session?.user ?? null,
    });

    if (session?.user) {
      useProfileStore.getState().fetchMyProfile();
    } else {
      //full app reset on logout
      useProfileStore.getState().reset?.();
      useChatStore.getState().reset();
      usePostsStore.getState().reset();
      useViewersStore.getState().reset();
      useInterestsStore.getState().reset();
    }
  });
}

let initialized = false;

export function initGoogleSignin() {
  if (initialized) return; // already configured
  if (Platform.OS === "web") return; // web uses separate logic

  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID!, // must be your Web OAuth client ID
    offlineAccess: false, // optional
    forceCodeForRefreshToken: false, // optional
    scopes: [
      /* what APIs you want to access on behalf of the user, default is email and profile
    this is just an example, most likely you don't need this option at all! */
      "https://www.googleapis.com/auth/drive.readonly",
    ],
  });

  initialized = true;
}
