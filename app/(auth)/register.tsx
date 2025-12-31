import { radixColors } from "@/_constants/colors";
import { SelectedTags, tagCategories } from "@/_constants/tags";
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

export default function Register() {
  const colorScheme = useColorScheme();
  const theme = radixColors[colorScheme ?? "dark"];
  const [activeTab, setActiveTab] = useState<"email" | "gmail">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [dateString, setDateString] = useState(
    new Date().toISOString().split("T")[0]
  ); // YYYY-MM-DD format
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<SelectedTags>({
    "travel-style": null,
    activities: [],
    lifestyle: [],
    "urban-leisure": [],
  });

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
    } catch {
      Alert.alert("Error", "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGmailAuth = async () => {
    setIsLoading(true);

    try {
      // Simulate Gmail OAuth call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Alert.alert("Success", "Connected with Gmail successfully!", [
        {
          text: "OK",
          onPress: () => router.replace("/(tabs)/radar"),
        },
      ]);
    } catch {
      Alert.alert("Error", "Gmail authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (text: string) => {
    setDateString(text);
  };

  const handleBackToLogin = () => {
    router.back();
  };

  const handleTagToggle = (
    category: keyof typeof selectedTags,
    tag: string
  ) => {
    if (category === "travel-style") {
      // Single selection: toggle or set
      setSelectedTags((prev) => ({
        ...prev,
        [category]: prev[category] === tag ? null : tag,
      }));
    } else {
      // Multi selection: add or remove
      setSelectedTags((prev) => {
        const currentTags = prev[category];
        const isSelected = currentTags.includes(tag);
        return {
          ...prev,
          [category]: isSelected
            ? currentTags.filter((t) => t !== tag)
            : [...currentTags, tag],
        };
      });
    }
  };

  const isTagSelected = (category: keyof typeof selectedTags, tag: string) => {
    if (category === "travel-style") {
      return selectedTags[category] === tag;
    }
    return selectedTags[category].includes(tag);
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

          {/* Authentication Card with Tabs */}
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
                disabled={isLoading}
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
                disabled={isLoading}
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
                </>
              ) : (
                <>
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

                  <TouchableOpacity
                    style={[
                      styles.gmailButton,
                      { backgroundColor: theme.solid[2] },
                      isLoading && styles.disabledButton,
                    ]}
                    onPress={handleGmailAuth}
                    disabled={isLoading}
                  >
                    <Text
                      style={[
                        styles.gmailButtonText,
                        { color: theme.background[1] },
                      ]}
                    >
                      {isLoading ? "Connecting..." : "Connect with Gmail"}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
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

          {/* Interests & Tags Section */}
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
              Interests & Tags (Optional)
            </Text>

            {Object.entries(tagCategories).map(([categoryKey, category]) => (
              <View key={categoryKey} style={styles.tagCategoryContainer}>
                <Text style={[styles.categoryLabel, { color: theme.text[2] }]}>
                  {category.title}
                  {!category.multiSelect && " (choose one)"}
                </Text>
                <View style={styles.tagsContainer}>
                  {category.tags.map((tag) => (
                    <TouchableOpacity
                      key={tag}
                      style={[
                        styles.tag,
                        {
                          backgroundColor: isTagSelected(
                            categoryKey as keyof typeof selectedTags,
                            tag
                          )
                            ? theme.solid[2]
                            : theme.background[1],
                          borderColor: isTagSelected(
                            categoryKey as keyof typeof selectedTags,
                            tag
                          )
                            ? theme.solid[2]
                            : theme.border[2],
                        },
                      ]}
                      onPress={() =>
                        handleTagToggle(
                          categoryKey as keyof typeof selectedTags,
                          tag
                        )
                      }
                      disabled={isLoading}
                    >
                      <Text
                        style={[
                          styles.tagText,
                          {
                            color: isTagSelected(
                              categoryKey as keyof typeof selectedTags,
                              tag
                            )
                              ? theme.background[1]
                              : theme.text[2],
                          },
                        ]}
                      >
                        {tag}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
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

          {activeTab === "email" && (
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
          )}

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
  gmailButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  gmailButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  tagCategoryContainer: {
    marginBottom: 20,
  },
  categoryLabel: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 14,
    fontWeight: "500",
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
