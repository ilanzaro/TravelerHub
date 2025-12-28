import { router } from "expo-router";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import LogoSVG from "../assets/svg/travel-hub.svg";
import { radixColors } from "./constants/colors";

export default function Index() {
  const colorScheme = useColorScheme();
  const theme = radixColors[colorScheme ?? "dark"];

  const handleLoginPress = () => {
    router.push("/(auth)/login");
  };

  const handleRegisterPress = () => {
    router.push("/(auth)/register");
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background[1] }]}>
      <View style={styles.content}>
        <View style={styles.logoPlaceholder}>
          <LogoSVG height={250} width={250} fill={theme.text[2]} />
          <Text style={[styles.subtitle, { color: theme.text[1] }]}>
            Connect with travelers around the world
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.solid[2] }]}
            onPress={handleLoginPress}
          >
            <Text style={[styles.buttonText, { color: theme.background[1] }]}>
              Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.secondaryButton,
              { borderColor: theme.solid[2] },
            ]}
            onPress={handleRegisterPress}
          >
            <Text style={[styles.buttonText, { color: theme.solid[2] }]}>
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
  logoPlaceholder: {
    alignItems: "center",
    gap: 20,
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
