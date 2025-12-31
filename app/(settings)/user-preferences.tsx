import { radixColors } from "@/_constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Appearance,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type PreferencesFormData = {
  showDistance: boolean;
  showAge: boolean;
  darkMode: boolean;
};

// Mock API call - replace with actual API later
const fetchPreferences = async (): Promise<PreferencesFormData> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const currentScheme = Appearance.getColorScheme();
  return {
    showDistance: true,
    showAge: false,
    darkMode: currentScheme === "dark",
  };
};

export default function UserPreferences() {
  const colorScheme = useColorScheme();
  const theme = radixColors[colorScheme ?? "dark"];
  const [isLoading, setIsLoading] = useState(true);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty, isSubmitting },
  } = useForm<PreferencesFormData>({
    defaultValues: {
      showDistance: true,
      showAge: false,
      darkMode: colorScheme === "dark",
    },
  });

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const data = await fetchPreferences();
        reset(data);
      } catch {
        Alert.alert("Error", "Failed to load preferences");
      } finally {
        setIsLoading(false);
      }
    };
    loadPreferences();
  }, [reset]);

  const onSubmit = async (data: PreferencesFormData) => {
    try {
      // TODO: Implement preferences update API call
      console.log("Preferences update:", data);

      // Apply dark mode change
      if (data.darkMode !== (colorScheme === "dark")) {
        Appearance.setColorScheme(data.darkMode ? "dark" : "light");
      }

      await new Promise((resolve) => setTimeout(resolve, 300));

      Alert.alert("Success", "Preferences updated!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert("Error", "Failed to save preferences");
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      Alert.alert(
        "Unsaved Changes",
        "You have unsaved changes. Are you sure you want to leave?",
        [
          { text: "Stay", style: "cancel" },
          { text: "Leave", style: "destructive", onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  };

  const darkMode = watch("darkMode");

  return (
    <View style={[styles.container, { backgroundColor: theme.background[1] }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.background[2],
            borderBottomColor: theme.border[2],
          },
        ]}
      >
        <TouchableOpacity
          onPress={handleCancel}
          disabled={isSubmitting}
          style={styles.headerButton}
        >
          <Text style={[styles.cancelText, { color: theme.text[2] }]}>
            Cancel
          </Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text[3] }]}>
          Preferences
        </Text>
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={!isDirty || isSubmitting}
          style={styles.headerButton}
        >
          <Text
            style={[
              styles.saveText,
              {
                color:
                  !isDirty || isSubmitting ? theme.text[1] : theme.solid[2],
              },
            ]}
          >
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: theme.text[2] }]}>
              Loading...
            </Text>
          </View>
        ) : (
          <View style={styles.tableContainer}>
            {/* Privacy Settings Section */}
            <View
              style={[
                styles.table,
                {
                  backgroundColor: theme.background[2],
                  borderColor: theme.border[2],
                },
              ]}
            >
              <View
                style={[
                  styles.tableRow,
                  { borderBottomColor: theme.border[2] },
                ]}
              >
                <View style={styles.rowContent}>
                  <Text style={[styles.rowLabel, { color: theme.text[3] }]}>
                    Show Distance
                  </Text>
                  <Text
                    style={[styles.rowDescription, { color: theme.text[1] }]}
                  >
                    Display your distance to other travelers
                  </Text>
                </View>
                <Controller
                  control={control}
                  name="showDistance"
                  render={({ field: { onChange, value } }) => (
                    <Switch
                      value={value}
                      onValueChange={onChange}
                      trackColor={{
                        false: theme.interactive[1],
                        true: theme.solid[2],
                      }}
                      thumbColor={theme.background[1]}
                      disabled={isSubmitting}
                    />
                  )}
                />
              </View>

              <View style={styles.tableRow}>
                <View style={styles.rowContent}>
                  <Text style={[styles.rowLabel, { color: theme.text[3] }]}>
                    Show My Age
                  </Text>
                  <Text
                    style={[styles.rowDescription, { color: theme.text[1] }]}
                  >
                    Display your age on your profile
                  </Text>
                </View>
                <Controller
                  control={control}
                  name="showAge"
                  render={({ field: { onChange, value } }) => (
                    <Switch
                      value={value}
                      onValueChange={onChange}
                      trackColor={{
                        false: theme.interactive[1],
                        true: theme.solid[2],
                      }}
                      thumbColor={theme.background[1]}
                      disabled={isSubmitting}
                    />
                  )}
                />
              </View>
            </View>

            {/* Appearance Section */}
            <View
              style={[
                styles.table,
                {
                  backgroundColor: theme.background[2],
                  borderColor: theme.border[2],
                },
              ]}
            >
              <View style={styles.tableRow}>
                <View style={styles.rowContent}>
                  <View style={styles.rowLabelContainer}>
                    <Ionicons
                      name={darkMode ? "moon" : "sunny"}
                      size={20}
                      color={theme.solid[2]}
                      style={styles.modeIcon}
                    />
                    <Text style={[styles.rowLabel, { color: theme.text[3] }]}>
                      {darkMode ? "Dark Mode" : "Light Mode"}
                    </Text>
                  </View>
                  <Text
                    style={[styles.rowDescription, { color: theme.text[1] }]}
                  >
                    {darkMode
                      ? "Switch to light theme"
                      : "Switch to dark theme"}
                  </Text>
                </View>
                <Controller
                  control={control}
                  name="darkMode"
                  render={({ field: { onChange, value } }) => (
                    <Switch
                      value={value}
                      onValueChange={onChange}
                      trackColor={{
                        false: theme.interactive[1],
                        true: theme.solid[2],
                      }}
                      thumbColor={theme.background[1]}
                      disabled={isSubmitting}
                    />
                  )}
                />
              </View>
            </View>
          </View>
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerButton: {
    minWidth: 60,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  cancelText: {
    fontSize: 17,
  },
  saveText: {
    fontSize: 17,
    fontWeight: "600",
    textAlign: "right",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  loadingText: {
    fontSize: 16,
  },
  tableContainer: {
    gap: 24,
  },
  table: {
    borderRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  rowContent: {
    flex: 1,
    marginRight: 12,
  },
  rowLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  modeIcon: {
    marginRight: 8,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  rowDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
});
