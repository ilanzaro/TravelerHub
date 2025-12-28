import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { radixColors } from "../constants/colors";

export default function AuthLayout() {
  const colorScheme = useColorScheme();
  const theme = radixColors[colorScheme ?? "dark"];
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.background[4] },
        headerTitleStyle: { color: theme.text[4] },
        headerTintColor: theme.solid[1],
        contentStyle: { backgroundColor: theme.background[1] },
        headerTitle: "",
        headerBackTitle: "",
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
