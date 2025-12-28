import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { radixColors } from "./constants/colors";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  console.log("Color Scheme:", colorScheme);
  const theme = radixColors[colorScheme ?? "dark"];
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
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(settings)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
