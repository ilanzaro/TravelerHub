import { Link } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Login() {
  return (
    <View>
      <Text>login</Text>
      <Link href="/radar">Go to Radar</Link>
    </View>
  );
}

const styles = StyleSheet.create({});
