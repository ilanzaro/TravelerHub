import { radixColors } from "@/_constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import MenuDropdown, { MenuOption } from "./MenuDropdown";

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
  const theme = radixColors[colorScheme ?? "dark"];
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDirectsPress = () => {
    router.push("/directs");
  };

  const handleProfilePress = () => {
    setShowDropdown(!showDropdown);
  };

  const menuOptions: MenuOption[] = [
    {
      id: "profile",
      label: "Profile",
      icon: "person",
      onPress: () => router.push("/(settings)/profile-edit"),
    },
    {
      id: "preferences",
      label: "Preferences",
      icon: "settings",
      onPress: () => router.push("/(settings)/user-preferences"),
    },
    {
      id: "logout",
      label: "Logout",
      icon: "log-out",
      onPress: () => router.push("/(auth)/login"),
    },
  ];

  return (
    <View style={styles.headerContainer}>
      <View style={styles.menuContainer}>
        <TouchableOpacity onPress={handleProfilePress}>
          <Ionicons name="person-circle" size={24} color={theme.solid[1]} />
        </TouchableOpacity>

        <MenuDropdown
          visible={showDropdown}
          onClose={() => setShowDropdown(false)}
          options={menuOptions}
        />
      </View>
      <Ionicons name="search" size={24} color={theme.solid[1]} />
      <TextInput
        style={[styles.searchInput, { backgroundColor: theme.background[2] }]}
        placeholder={placeholder}
        placeholderTextColor={theme.text[1]}
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
  menuContainer: {
    position: "relative",
  },
});
