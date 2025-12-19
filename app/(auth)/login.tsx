import { Link } from "expo-router";
import React from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import { Colors } from "../constants/colors";

export default function Login() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "dark"];
  return (
    <View>
      <Text>login</Text>
      <Link href="/radar">Go to Radar</Link>
    </View>
  );
}

const styles = StyleSheet.create({});
