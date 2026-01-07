import { radixColors } from "@/_constants/colors";
import { initAuthListener } from "@/lib/auth/auth-init";
import { useAuthStore } from "@/stores/authStore";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = radixColors[colorScheme ?? "dark"];
  const { session, initialized } = useAuthStore();

  useEffect(() => {
    initAuthListener();
  }, []);

  console.log("session", session);
  if (!initialized) return null;
  const isLoggedIn = !!session;
  //const isLoggedIn = true;

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.background[4] },
          headerTitleStyle: { color: theme.text[4] },
          headerTintColor: theme.solid[1],
          contentStyle: { backgroundColor: theme.background[1] },
        }}
      >
        {/* Public routes */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />

        {/* Protected routes */}
        <Stack.Protected guard={isLoggedIn}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(settings)" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
    </>
  );
}
