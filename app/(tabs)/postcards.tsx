import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, useColorScheme } from "react-native";
import { radixColors } from "../constants/colors";

export default function Postcards() {
  const colorScheme = useColorScheme();
  const theme = radixColors[colorScheme ?? "light"];

  return (
    <LinearGradient
      colors={[theme.background[3], theme.background[1]]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
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
