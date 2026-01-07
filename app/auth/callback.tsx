import { supabase } from "@/lib/supabase";
import { useProfileStore } from "@/stores/profilesStore";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function AuthCallback() {
  useEffect(() => {
    const handleOAuth = async () => {
      // Required to complete the OAuth session on native
      WebBrowser.maybeCompleteAuthSession();

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session?.user) {
        console.error("OAuth callback error:", error?.message);
        router.replace("/(auth)/login");
        return;
      }

      // Fetch profile if user exists
      const profileStore = useProfileStore.getState();
      await profileStore.fetchMyProfile();

      router.replace(
        profileStore.hasProfile ? "/(tabs)/radar" : "/(auth)/register"
      );
    };

    handleOAuth();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
