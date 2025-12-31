import { radixColors } from "@/_constants/colors";
import { SelectedTags, tagCategories } from "@/_constants/tags";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type ProfileFormData = {
  nickname: string;
  location: string;
  bio: string;
  selectedTags: SelectedTags;
};

// Mock API call - replace with actual API later
const fetchProfile = async (): Promise<ProfileFormData> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    nickname: "traveler123",
    location: "San Francisco, CA",
    bio: "Love exploring new places!",
    selectedTags: {
      "travel-style": "solo",
      activities: ["hiking", "diving"],
      lifestyle: ["culture", "art"],
      "urban-leisure": ["food"],
    },
  };
};

export default function ProfileEdit() {
  const colorScheme = useColorScheme();
  const theme = radixColors[colorScheme ?? "dark"];
  const [isLoading, setIsLoading] = useState(true);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isDirty, isSubmitting },
  } = useForm<ProfileFormData>({
    defaultValues: {
      nickname: "",
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

  useEffect(() => {
    // Fetch profile data from API
    const loadProfile = async () => {
      try {
        const data = await fetchProfile();
        reset(data);
      } catch {
        Alert.alert("Error", "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, [reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      // TODO: Replace with actual API call
      console.log("Saving profile:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      Alert.alert("Success", "Profile updated!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert("Error", "Failed to save profile");
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      Alert.alert(
        "Discard Changes?",
        "You have unsaved changes. Are you sure?",
        [
          { text: "Keep Editing", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      router.back();
    }
  };

  const toggleTag = (category: keyof SelectedTags, tag: string) => {
    if (category === "travel-style") {
      setValue(
        "selectedTags",
        {
          ...selectedTags,
          [category]: selectedTags[category] === tag ? null : tag,
        },
        { shouldDirty: true }
      );
    } else {
      const current = selectedTags[category];
      const isSelected = current.includes(tag);
      setValue(
        "selectedTags",
        {
          ...selectedTags,
          [category]: isSelected
            ? current.filter((t) => t !== tag)
            : [...current, tag],
        },
        { shouldDirty: true }
      );
    }
  };

  const isSelected = (category: keyof SelectedTags, tag: string) => {
    if (category === "travel-style") return selectedTags[category] === tag;
    return selectedTags[category].includes(tag);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background[1] }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} disabled={isSubmitting}>
          <Text
            style={[
              styles.headerButton,
              { color: isSubmitting ? theme.text["alpha-1"] : theme.solid[2] },
            ]}
          >
            Cancel
          </Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text[4] }]}>
          Edit Profile
        </Text>
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={!isDirty || isSubmitting || isLoading}
        >
          <Text
            style={[
              styles.headerButton,
              {
                color:
                  !isDirty || isSubmitting || isLoading
                    ? theme.text["alpha-1"]
                    : theme.solid[2],
              },
            ]}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: theme.text[2] }]}>
              Loading profile...
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text[3] }]}>
                ABOUT
              </Text>

              <Text style={[styles.fieldLabel, { color: theme.text[2] }]}>
                Nickname
              </Text>
              <Controller
                control={control}
                name="nickname"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.field,
                      {
                        backgroundColor: theme.interactive[1],
                        color: theme.text[3],
                        borderColor: theme.border[2],
                      },
                    ]}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Your nickname"
                    placeholderTextColor={theme.text["alpha-1"]}
                    editable={!isSubmitting}
                  />
                )}
              />

              <Text style={[styles.fieldLabel, { color: theme.text[2] }]}>
                Location
              </Text>
              <Controller
                control={control}
                name="location"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.field,
                      {
                        backgroundColor: theme.interactive[1],
                        color: theme.text[3],
                        borderColor: theme.border[2],
                      },
                    ]}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Your location"
                    placeholderTextColor={theme.text["alpha-1"]}
                    editable={!isSubmitting}
                  />
                )}
              />

              <Text style={[styles.fieldLabel, { color: theme.text[2] }]}>
                Bio
              </Text>
              <Controller
                control={control}
                name="bio"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.bioField,
                      {
                        backgroundColor: theme.interactive[1],
                        color: theme.text[3],
                        borderColor: theme.border[2],
                      },
                    ]}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="About you..."
                    placeholderTextColor={theme.text["alpha-1"]}
                    multiline
                    editable={!isSubmitting}
                  />
                )}
              />
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text[3] }]}>
                INTERESTS
              </Text>

              {Object.entries(tagCategories).map(([key, category]) => (
                <View key={key} style={styles.tagGroup}>
                  <Text
                    style={[styles.tagGroupTitle, { color: theme.text[2] }]}
                  >
                    {category.title}
                  </Text>
                  <View style={styles.tags}>
                    {category.tags.map((tag) => (
                      <TouchableOpacity
                        key={tag}
                        style={[
                          styles.tagButton,
                          {
                            backgroundColor: isSelected(
                              key as keyof SelectedTags,
                              tag
                            )
                              ? theme.solid[2]
                              : theme.interactive[1],
                            borderColor: theme.border[2],
                          },
                        ]}
                        onPress={() =>
                          toggleTag(key as keyof SelectedTags, tag)
                        }
                        disabled={isSubmitting}
                      >
                        <Text
                          style={[
                            styles.tagButtonText,
                            {
                              color: isSelected(key as keyof SelectedTags, tag)
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
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerButton: {
    fontSize: 16,
    fontWeight: "500",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 8,
    marginTop: 12,
  },
  field: {
    height: 44,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  bioField: {
    minHeight: 80,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    textAlignVertical: "top",
  },
  tagGroup: {
    marginBottom: 20,
  },
  tagGroupTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 10,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  tagButtonText: {
    fontSize: 13,
    fontWeight: "500",
  },
});
