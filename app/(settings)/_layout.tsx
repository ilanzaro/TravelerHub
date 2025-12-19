import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { Colors } from "../constants/colors";

export default function SettingsLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "dark"];
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.navBackground },
        headerTitleStyle: { color: theme.title },
        headerTintColor: theme.icon,
        contentStyle: { backgroundColor: theme.background },
      }}
    >
      <Stack.Screen
        name="profile-edit"
        options={{ title: "Profile Edit", headerTitle: "TravelerHub" }}
      />
    </Stack>
  );
}
