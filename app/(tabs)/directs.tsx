import React from "react";
import { StyleSheet, Text, View, useColorScheme } from "react-native";
import { Colors } from "../constants/colors";

export default function Directs() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text>Directs</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
