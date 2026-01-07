import { radixColors } from "@/_constants/colors";
import { SelectedTags, tagCategories } from "@/_constants/tags";
import { useAuthStore } from "@/stores/authStore";
import { useProfileStore } from "@/stores/profilesStore";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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

type RegisterFormData = {
  email: string;
  password: string;
  repeatPassword: string;
  nickname: string;
  dateOfBirth: string;
  location: string;
  bio: string;
  selectedTags: SelectedTags;
};

export default function Register() {
  const colorScheme = useColorScheme();
  const theme = radixColors[colorScheme ?? "dark"];

  const [activeTab, setActiveTab] = useState<"email" | "google">("email");
  const [googleConnected, setGoogleConnected] = useState(false);
  const { createProfile } = useProfileStore();
  const { signIn, signInGoogleVerify } = useAuthStore();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<RegisterFormData>({
    defaultValues: {
      email: "",
      password: "",
      repeatPassword: "",
      nickname: "",
      dateOfBirth: new Date().toISOString().split("T")[0],
      location: "",
      bio: "",
      selectedTags: {
        "travel-style": null,
        activities: [],
        lifestyle: [],
        "urban-leisure": [],
      },
    },
  });

  const selectedTags = watch("selectedTags");

  /* --------------------------------
   * GOOGLE – PHASE 1 (CONNECT ONLY)
   * -------------------------------- */
  const handleGoogleConnect = async () => {
    try {
      const googleUser = await signInGoogleVerify();

      if (googleUser?.email) {
        setValue("email", googleUser.email);
      }

      setGoogleConnected(true);

      Alert.alert(
        "Google connected",
        "Please complete the remaining fields and create your account"
      );
    } catch (e: any) {
      Alert.alert("Google authentication failed", e.message);
    }
  };

  /* --------------------------------
   * SUBMIT
   * -------------------------------- */
  const onSubmit = async (data: RegisterFormData) => {
    try {
      if (!data.nickname) {
        Alert.alert("Nickname is required");
        return;
      }

      if (activeTab === "email") {
        if (data.password !== data.repeatPassword) {
          Alert.alert("Passwords do not match");
          return;
        }

        await signIn(data.email, data.password);

        await createProfile({
          nickname: data.nickname,
          birth_date: data.dateOfBirth,
          last_location: data.location,
          bio: data.bio,
          tags: data.selectedTags,
          provider: "email",
        });
      }

      if (activeTab === "google") {
        if (!googleConnected) {
          Alert.alert("Please connect your Google account first");
          return;
        }

        await createProfile({
          nickname: data.nickname,
          birth_date: data.dateOfBirth,
          last_location: data.location,
          bio: data.bio,
          tags: data.selectedTags,
          provider: "google",
        });
      }

      // Safety check: only navigate if both user and profile exist
      const authUser = useAuthStore.getState().user;
      const profile = useProfileStore.getState().myProfile;

      if (!authUser || !profile) {
        Alert.alert(
          "Incomplete Setup",
          "Your account or profile is not ready yet."
        );
        return;
      }

      router.replace("/(tabs)/radar");
    } catch (e: any) {
      Alert.alert("Signup failed", e.message);
    }
  };

  const handleBackToLogin = () => router.back();

  const handleTagToggle = (category: keyof SelectedTags, tag: string) => {
    if (category === "travel-style") {
      setValue("selectedTags", {
        ...selectedTags,
        [category]: selectedTags[category] === tag ? null : tag,
      });
    } else {
      const current = selectedTags[category];
      setValue("selectedTags", {
        ...selectedTags,
        [category]: current.includes(tag)
          ? current.filter((t) => t !== tag)
          : [...current, tag],
      });
    }
  };

  const isTagSelected = (category: keyof SelectedTags, tag: string) => {
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

          {/* AUTH CARD */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.interactive[2],
                borderColor: theme.border[3],
              },
            ]}
          >
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
                onPress={() => setActiveTab("google")}
              >
                <Text
                  style={[
                    styles.tabText,
                    {
                      color:
                        activeTab === "google"
                          ? theme.text[4]
                          : theme.text["alpha-1"],
                    },
                  ]}
                >
                  Gmail
                </Text>
                {activeTab === "google" && (
                  <View
                    style={[
                      styles.tabIndicator,
                      { backgroundColor: theme.solid[2] },
                    ]}
                  />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.tabContent}>
              {activeTab === "email" ? (
                <>
                  <View style={styles.inputContainer}>
                    <Text style={[styles.label, { color: theme.text[1] }]}>
                      Email *
                    </Text>
                    <Controller
                      control={control}
                      name="email"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          style={[
                            styles.input,
                            {
                              backgroundColor: theme.background[1],
                              borderColor: theme.border[2],
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
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={[styles.label, { color: theme.text[1] }]}>
                      Password *
                    </Text>
                    <Controller
                      control={control}
                      name="password"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          style={[
                            styles.input,
                            {
                              backgroundColor: theme.background[1],
                              borderColor: theme.border[2],
                              color: theme.text[2],
                            },
                          ]}
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder="Create a password"
                          placeholderTextColor={theme.text["alpha-1"]}
                          secureTextEntry
                          autoCapitalize="none"
                          autoCorrect={false}
                          editable={!isSubmitting}
                        />
                      )}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={[styles.label, { color: theme.text[1] }]}>
                      Repeat Password *
                    </Text>
                    <Controller
                      control={control}
                      name="repeatPassword"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          style={[
                            styles.input,
                            {
                              backgroundColor: theme.background[1],
                              borderColor: theme.border[2],
                              color: theme.text[2],
                            },
                          ]}
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder="Repeat your password"
                          placeholderTextColor={theme.text["alpha-1"]}
                          secureTextEntry
                          autoCapitalize="none"
                          autoCorrect={false}
                          editable={!isSubmitting}
                        />
                      )}
                    />
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.inputContainer}>
                    <Text style={[styles.label, { color: theme.text[1] }]}>
                      Nickname *
                    </Text>
                    <Controller
                      control={control}
                      name="nickname"
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          style={[
                            styles.input,
                            {
                              backgroundColor: theme.background[1],
                              borderColor: theme.border[2],
                              color: theme.text[2],
                            },
                          ]}
                          value={value}
                          onChangeText={onChange}
                          placeholder="Choose a nickname"
                          placeholderTextColor={theme.text["alpha-1"]}
                        />
                      )}
                    />
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.gmailButton,
                      { backgroundColor: theme.solid[2] },
                      googleConnected && styles.disabledButton,
                    ]}
                    onPress={handleGoogleConnect}
                    disabled={googleConnected}
                  >
                    <Text
                      style={[
                        styles.gmailButtonText,
                        { color: theme.background[1] },
                      ]}
                    >
                      {googleConnected
                        ? "Google Connected ✓"
                        : "Connect with Gmail"}
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
              <Controller
                control={control}
                name="dateOfBirth"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.background[1],
                        borderColor: theme.border[2],
                        color: theme.text[2],
                      },
                    ]}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={theme.text["alpha-1"]}
                    keyboardType="numeric"
                    maxLength={10}
                    editable={!isSubmitting}
                  />
                )}
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
                      disabled={isSubmitting}
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
              <Controller
                control={control}
                name="location"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.background[1],
                        borderColor: theme.border[2],
                        color: theme.text[2],
                      },
                    ]}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Where are you from?"
                    placeholderTextColor={theme.text["alpha-1"]}
                    editable={!isSubmitting}
                  />
                )}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.text[1] }]}>Bio</Text>
              <Controller
                control={control}
                name="bio"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.textArea,
                      {
                        backgroundColor: theme.background[1],
                        borderColor: theme.border[2],
                        color: theme.text[2],
                      },
                    ]}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Tell us about yourself..."
                    placeholderTextColor={theme.text["alpha-1"]}
                    multiline
                    numberOfLines={3}
                    editable={!isSubmitting}
                  />
                )}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.registerButton,
              { backgroundColor: theme.solid[2] },
              isSubmitting && styles.disabledButton,
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            <Text
              style={[
                styles.registerButtonText,
                { color: theme.background[1] },
              ]}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
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
