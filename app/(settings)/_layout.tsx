import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="profile-edit"
        options={{ title: "Profile Edit", headerTitle: "TravelerHub" }}
      />
    </Stack>
  );
}
