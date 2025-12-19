import { Colors } from "@/app/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

interface TabHeaderProps {
  onSearchChange?: (text: string) => void;
  placeholder?: string;
  navIcon?: React.ReactNode;
}

export default function TabHeader({
  onSearchChange,
  placeholder = "Search...",
  navIcon,
}: TabHeaderProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "dark"];

  const handleDirectsPress = () => {
    router.push("/directs");
  };

  return (
    <View style={styles.headerContainer}>
      <Ionicons name="person-circle" size={24} color={theme.icon} />
      <Ionicons name="search" size={24} color={theme.icon} />
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        placeholderTextColor={theme.text}
        onChangeText={onSearchChange}
      />
      {navIcon && (
        <TouchableOpacity onPress={handleDirectsPress}>
          {navIcon}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 12,
    width: "100%",
  },
  searchInput: {
    flex: 1,
    height: 36,
    paddingHorizontal: 8,
  },
});
