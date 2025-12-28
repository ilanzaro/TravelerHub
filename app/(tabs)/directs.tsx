import React from "react";
import { StyleSheet, Text, View, useColorScheme } from "react-native";
import { radixColors } from "../constants/colors";

export default function Directs() {
  const colorScheme = useColorScheme();
  const theme = radixColors[colorScheme ?? "light"];

  return (
    <View style={[styles.container, { backgroundColor: theme.background[1] }]}>
      <Text>Directs</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
