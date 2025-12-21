import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { Colors } from "../constants/colors";

export default function AuthLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "dark"];
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.navBackground },
        headerTitleStyle: { color: theme.title },
        headerTintColor: theme.icon,
        contentStyle: { backgroundColor: theme.background },
        headerTitle: "",
        headerBackTitle: "",
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
