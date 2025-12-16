import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

interface TabHeaderProps {
  onSearchChange?: (text: string) => void;
  placeholder?: string;
}

export default function TabHeader({
  onSearchChange,
  placeholder = "Search...",
}: TabHeaderProps) {
  const handleDirectsPress = () => {
    router.push("/directs");
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor="#666"
          onChangeText={onSearchChange}
        />
      </View>
      <TouchableOpacity
        onPress={handleDirectsPress}
        style={styles.directsButton}
      >
        <Ionicons name="chatbox-ellipses" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 36,
    fontSize: 16,
    color: "#333",
  },
  directsButton: {
    padding: 8,
  },
});
