import { radixColors } from "@/_constants/colors";
import { signInWithGoogle } from "@/lib/auth/googleAuth";
import { useAuthStore } from "@/stores/authStore";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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

type LoginFormData = {
  email: string;
  password: string;
};

export default function Login() {
  const colorScheme = useColorScheme();
  const theme = radixColors[colorScheme ?? "dark"];
  const [activeTab, setActiveTab] = useState<"email" | "gmail">("email");
  const { signIn } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      await signIn(data.email, data.password);
      router.replace("/(tabs)/radar");
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Login failed. Please try again.");
    }
  };

  const handleForgotPassword = () => {
    Alert.alert("Forgot Password", "Password reset functionality coming soon!");
  };

  const handleGmailAuth = async () => {
    try {
      // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      await signInWithGoogle();
      // Navigation will be handled by auth state change
    } catch (error) {
      console.error("Gmail auth error:", error);
      Alert.alert("Error", "Gmail authentication failed. Please try again.");
    }
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

          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.interactive[2],
                borderColor: theme.border[3],
              },
            ]}
          >
            {/* Tab Selector */}
            <View
              style={[
                styles.tabContainer,
                { borderBottomColor: theme.border[2] },
              ]}
            >
              <TouchableOpacity
                style={styles.tab}
                onPress={() => setActiveTab("email")}
                disabled={isSubmitting}
              >
                <Text
                  style={[
                    styles.tabText,
                    {
                      color:
                        activeTab === "email"
                          ? theme.text[4]
                          : theme.text["alpha-1"],
                    },
                  ]}
                >
                  Email & Password
                </Text>
                {activeTab === "email" && (
                  <View
                    style={[
                      styles.tabIndicator,
                      { backgroundColor: theme.solid[2] },
                    ]}
                  />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.tab}
                onPress={() => setActiveTab("gmail")}
                disabled={isSubmitting}
              >
                <Text
                  style={[
                    styles.tabText,
                    {
                      color:
                        activeTab === "gmail"
                          ? theme.text[4]
                          : theme.text["alpha-1"],
                    },
                  ]}
                >
                  Gmail
                </Text>
                {activeTab === "gmail" && (
                  <View
                    style={[
                      styles.tabIndicator,
                      { backgroundColor: theme.solid[2] },
                    ]}
                  />
                )}
              </TouchableOpacity>
            </View>

            {/* Tab Content */}
            <View style={styles.tabContent}>
              {activeTab === "email" ? (
                <>
                  <View style={styles.inputContainer}>
                    <Text style={[styles.label, { color: theme.text[1] }]}>
                      Email
                    </Text>
                    <Controller
                      control={control}
                      name="email"
                      rules={{
                        required: "Email is required",
                      }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          style={[
                            styles.input,
                            {
                              backgroundColor: theme.interactive[1],
                              borderColor: errors.email
                                ? theme.border[2]
                                : theme.border[2],
                              color: theme.text[2],
                            },
                          ]}
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder="Enter your email"
                          placeholderTextColor={theme.text["alpha-1"]}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          autoCorrect={false}
                          editable={!isSubmitting}
                        />
                      )}
                    />
                    {errors.email && (
                      <Text
                        style={[styles.errorText, { color: theme.border[2] }]}
                      >
                        {errors.email.message}
                      </Text>
                    )}
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={[styles.label, { color: theme.text[1] }]}>
                      Password
                    </Text>
                    <Controller
                      control={control}
                      name="password"
                      rules={{
                        required: "Password is required",
                        /*                   minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  }, */
                      }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          style={[
                            styles.input,
                            {
                              backgroundColor: theme.interactive[1],
                              borderColor: errors.password
                                ? theme.border[2]
                                : theme.border[2],
                              color: theme.text[2],
                            },
                          ]}
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder="Enter your password"
                          placeholderTextColor={theme.text["alpha-1"]}
                          secureTextEntry
                          autoCapitalize="none"
                          autoCorrect={false}
                          editable={!isSubmitting}
                        />
                      )}
                    />
                    {errors.password && (
                      <Text
                        style={[styles.errorText, { color: theme.border[2] }]}
                      >
                        {errors.password.message}
                      </Text>
                    )}
                  </View>

                  <TouchableOpacity onPress={handleForgotPassword}>
                    <Text
                      style={[styles.forgotPassword, { color: theme.solid[2] }]}
                    >
                      Forgot your password?
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.loginButton,
                      { backgroundColor: theme.solid[2] },
                      isSubmitting && styles.disabledButton,
                    ]}
                    onPress={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                  >
                    <Text
                      style={[
                        styles.loginButtonText,
                        { color: theme.background[1] },
                      ]}
                    >
                      {isSubmitting ? "Signing in..." : "Sign In"}
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text
                    style={[styles.gmailDescription, { color: theme.text[1] }]}
                  >
                    Sign in quickly with your Gmail account
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.gmailButton,
                      { backgroundColor: theme.solid[2] },
                      isSubmitting && styles.disabledButton,
                    ]}
                    onPress={handleGmailAuth}
                    disabled={isSubmitting}
                  >
                    <Text
                      style={[
                        styles.gmailButtonText,
                        { color: theme.background[1] },
                      ]}
                    >
                      {isSubmitting ? "Connecting..." : "Sign in with Gmail"}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.text[1] }]}>
              {"Don't have an account? "}
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
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 24,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
    marginHorizontal: -20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    position: "relative",
  },
  tabText: {
    fontSize: 15,
    fontWeight: "500",
  },
  tabIndicator: {
    position: "absolute",
    bottom: -1,
    left: 0,
    right: 0,
    height: 2,
  },
  tabContent: {
    marginTop: 4,
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
  gmailDescription: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 20,
    opacity: 0.8,
  },
  gmailButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  gmailButtonText: {
    fontSize: 16,
    fontWeight: "600",
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
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});
