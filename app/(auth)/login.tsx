import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { radixColors } from "../constants/colors";

export default function Login() {
  const colorScheme = useColorScheme();
  const theme = radixColors[colorScheme ?? "dark"];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    router.replace("/(tabs)/radar");
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate to main app on success
      router.replace("/(tabs)/radar");
    } catch (error) {
      Alert.alert("Error", "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert("Forgot Password", "Password reset functionality coming soon!");
  };

  return (
    <LinearGradient
      colors={[theme.background[4], theme.background[1]]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.text[4] }]}>
            Welcome Back
          </Text>
          <Text style={[styles.subtitle, { color: theme.text[1] }]}>
            Sign in to your account
          </Text>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.text[1] }]}>
                Email
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.interactive[1],
                    borderColor: theme.border[2],
                    color: theme.text[2],
                  },
                ]}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={theme.text["alpha-1"]}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.text[1] }]}>
                Password
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.interactive[1],
                    borderColor: theme.border[2],
                    color: theme.text[2],
                  },
                ]}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={theme.text["alpha-1"]}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>

            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={[styles.forgotPassword, { color: theme.solid[2] }]}>
                Forgot your password?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.loginButton,
                { backgroundColor: theme.solid[2] },
                isLoading && styles.disabledButton,
              ]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text
                style={[styles.loginButtonText, { color: theme.background[1] }]}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: theme.text[1] }]}>
                {"Don't have an account?"}
              </Text>
              <Link href="/(auth)/register" asChild>
                <TouchableOpacity>
                  <Text style={[styles.linkText, { color: theme.solid[2] }]}>
                    Sign up
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
    opacity: 0.8,
  },
  form: {
    flex: 1,
    justifyContent: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  forgotPassword: {
    fontSize: 14,
    textAlign: "right",
    marginTop: -10,
    marginBottom: 32,
  },
  loginButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  disabledButton: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
  },
  linkText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
