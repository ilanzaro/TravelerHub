import { StyleSheet, Text, View, useColorScheme } from "react-native";
import { radixColors } from "../constants/colors";

export default function Radar() {
  const colorScheme = useColorScheme();
  const theme = radixColors[colorScheme ?? "light"];

  return (
    <View style={[styles.container, { backgroundColor: theme.background[1] }]}>
      <Text>Radar</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
