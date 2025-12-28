import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { radixColors } from "../constants/colors";

export default function Register() {
  const colorScheme = useColorScheme();
  const theme = radixColors[colorScheme ?? "dark"];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [dateString, setDateString] = useState(
    new Date().toISOString().split("T")[0]
  ); // YYYY-MM-DD format
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Alert.alert("Success", "Account created successfully!", [
        {
          text: "OK",
          onPress: () => router.replace("/(tabs)/radar"),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (text: string) => {
    setDateString(text);
    // Convert to Date object if needed
    const date = new Date(text);
    if (!isNaN(date.getTime())) {
      setDateOfBirth(date);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  const handleBackToLogin = () => {
    router.back();
  };

  return (
    <LinearGradient
      colors={[theme.background[3], theme.background[1]]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBackToLogin}>
              <Text style={[styles.backButton, { color: theme.solid[2] }]}>
                ← Return to login
              </Text>
            </TouchableOpacity>

            <Text style={[styles.title, { color: theme.text[4] }]}>
              Create Account
            </Text>
            <Text style={[styles.subtitle, { color: theme.text[1] }]}>
              Join the TravelerHub community
            </Text>
          </View>

          {/* Required Information Card */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.interactive[2],
                borderColor: theme.border[3],
              },
            ]}
          >
            <Text style={[styles.cardTitle, { color: theme.text[4] }]}>
              Required Information *
            </Text>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.text[1] }]}>
                Email *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.background[1],
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
                Nickname *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.background[1],
                    borderColor: theme.border[2],
                    color: theme.text[2],
                  },
                ]}
                value={nickname}
                onChangeText={setNickname}
                placeholder="Choose a nickname"
                placeholderTextColor={theme.text["alpha-1"]}
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.text[1] }]}>
                Password *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.background[1],
                    borderColor: theme.border[2],
                    color: theme.text[2],
                  },
                ]}
                value={password}
                onChangeText={setPassword}
                placeholder="Create a password"
                placeholderTextColor={theme.text["alpha-1"]}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.text[1] }]}>
                Repeat Password *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.background[1],
                    borderColor: theme.border[2],
                    color: theme.text[2],
                  },
                ]}
                value={repeatPassword}
                onChangeText={setRepeatPassword}
                placeholder="Repeat your password"
                placeholderTextColor={theme.text["alpha-1"]}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Date of Birth Section */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.interactive[2],
                borderColor: theme.border[3],
              },
            ]}
          >
            <Text style={[styles.cardTitle, { color: theme.text[4] }]}>
              Date of Birth
            </Text>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.text[1] }]}>
                Birthday
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.background[1],
                    borderColor: theme.border[2],
                    color: theme.text[2],
                  },
                ]}
                value={dateString}
                onChangeText={handleDateChange}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={theme.text["alpha-1"]}
                keyboardType="numeric"
                maxLength={10}
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Additional Information Section */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.interactive[2],
                borderColor: theme.border[3],
              },
            ]}
          >
            <Text style={[styles.cardTitle, { color: theme.text[4] }]}>
              Additional Information (Optional)
            </Text>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.text[1] }]}>
                Location
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.background[1],
                    borderColor: theme.border[2],
                    color: theme.text[2],
                  },
                ]}
                value={location}
                onChangeText={setLocation}
                placeholder="Where are you from?"
                placeholderTextColor={theme.text["alpha-1"]}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.text[1] }]}>Bio</Text>
              <TextInput
                style={[
                  styles.textArea,
                  {
                    backgroundColor: theme.background[1],
                    borderColor: theme.border[2],
                    color: theme.text[2],
                  },
                ]}
                value={bio}
                onChangeText={setBio}
                placeholder="Tell us about yourself..."
                placeholderTextColor={theme.text["alpha-1"]}
                multiline
                numberOfLines={3}
                editable={!isLoading}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.registerButton,
              { backgroundColor: theme.solid[2] },
              isLoading && styles.disabledButton,
            ]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text
              style={[
                styles.registerButtonText,
                { color: theme.background[1] },
              ]}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.text[1] }]}>
              Already have an account?{" "}
            </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={[styles.linkText, { color: theme.solid[2] }]}>
                  Sign in
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    fontSize: 16,
    marginBottom: 20,
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
    marginBottom: 30,
    opacity: 0.8,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
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
  textArea: {
    minHeight: 80,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    textAlignVertical: "top",
  },
  dateButton: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  dateButtonText: {
    fontSize: 16,
  },
  registerButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 24,
  },
  disabledButton: {
    opacity: 0.6,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
  },
  linkText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
