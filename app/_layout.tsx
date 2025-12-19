import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { Colors } from "./constants/colors";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  console.log("Color Scheme:", colorScheme);
  const theme = Colors[colorScheme ?? "dark"];
  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.navBackground },
          headerTitleStyle: { color: theme.title },
          headerTintColor: theme.icon,
          contentStyle: { backgroundColor: theme.background },
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: "Home", headerTitle: "TravelerHub" }}
        />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(settings)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
