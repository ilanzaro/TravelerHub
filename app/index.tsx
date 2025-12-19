import { router } from "expo-router";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Colors } from "./constants/colors";

export default function Index() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "dark"];

  const handleLoginPress = () => {
    router.push("/(auth)/login");
  };

  const handleRegisterPress = () => {
    router.push("/(auth)/register");
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.title }]}>TravelerHub</Text>
        <Text style={[styles.subtitle, { color: theme.text }]}>
          Connect with travelers around the world
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.iconFocused }]}
            onPress={handleLoginPress}
          >
            <Text style={[styles.buttonText, { color: theme.background }]}>
              Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.secondaryButton,
              { borderColor: theme.iconFocused },
            ]}
            onPress={handleRegisterPress}
          >
            <Text style={[styles.buttonText, { color: theme.iconFocused }]}>
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 32,
    width: "100%",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 48,
    textAlign: "center",
    opacity: 0.8,
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  button: {
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
  },
});
