import { radixColors } from "@/_constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, useColorScheme } from "react-native";

export default function Postcards() {
  const colorScheme = useColorScheme();
  const theme = radixColors[colorScheme ?? "light"];

  return (
    <LinearGradient
      colors={[theme.background[4], theme.background[1]]}
      style={styles.container}
    >
      <Text>Postcards</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
