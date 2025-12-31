import { radixColors } from "@/_constants/colors";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function SettingsLayout() {
  const colorScheme = useColorScheme();
  const theme = radixColors[colorScheme ?? "dark"];
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.background[4] },
        headerTitleStyle: { color: theme.text[4] },
        headerTintColor: theme.solid[1],
        contentStyle: { backgroundColor: theme.background[1] },
      }}
    >
      <Stack.Screen
        name="profile-edit"
        options={{ title: "Profile Edit", headerTitle: "TravelerHub" }}
      />
      <Stack.Screen
        name="user-preferences"
        options={{ title: "User Preferences", headerTitle: "TravelerHub" }}
      />
    </Stack>
  );
}
