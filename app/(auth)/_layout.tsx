import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{ title: "Login", headerTitle: "TravelerHub" }}
      />
      <Stack.Screen
        name="register"
        options={{ title: "Register", headerTitle: "TravelerHub" }}
      />
    </Stack>
  );
}
