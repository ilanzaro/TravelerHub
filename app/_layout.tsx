import { radixColors } from "@/_constants/colors";
// import { useAuthContext } from "@/hooks/use-auth-context";
// import AuthProvider from "@/providers/auth-provider";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  console.log("Color Scheme:", colorScheme);
  const theme = radixColors[colorScheme ?? "dark"];

  // TODO: Uncomment when auth is fully implemented
  // const { isLoggedIn, isLoading } = useAuthContext();
  // For now, hardcoded to true for development
  const isLoggedIn = true;

  return (
    // TODO: Wrap with AuthProvider when auth is fully implemented
    // <AuthProvider>
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.background[4] },
          headerTitleStyle: { color: theme.text[4] },
          headerTintColor: theme.solid[1],
          contentStyle: { backgroundColor: theme.background[1] },
        }}
      >
        {/* Public route - always accessible */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />

        {/* Protected routes - only accessible when logged in */}
        <Stack.Protected guard={isLoggedIn}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(settings)" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
    </>
    // </AuthProvider>
  );
}
