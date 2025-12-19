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
import { Colors } from "../constants/colors";

export default function Login() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "dark"];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
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
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.title }]}>Welcome Back</Text>
        <Text style={[styles.subtitle, { color: theme.text }]}>
          Sign in to your account
        </Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.text }]}>Email</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.navBackground,
                  borderColor: theme.icon,
                  color: theme.text,
                },
              ]}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={theme.text + "80"}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.text }]}>Password</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.navBackground,
                  borderColor: theme.icon,
                  color: theme.text,
                },
              ]}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor={theme.text + "80"}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={[styles.forgotPassword, { color: theme.iconFocused }]}>
              Forgot your password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.loginButton,
              { backgroundColor: theme.iconFocused },
              isLoading && styles.disabledButton,
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={[styles.loginButtonText, { color: theme.background }]}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.text }]}>
              {"Don't have an account?"}
            </Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity>
                <Text style={[styles.linkText, { color: theme.iconFocused }]}>
                  Sign up
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
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
