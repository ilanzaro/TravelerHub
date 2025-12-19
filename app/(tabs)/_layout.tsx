import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, useColorScheme } from "react-native";
import TabHeader from "../../components/TabHeader";
import { Colors } from "../constants/colors";

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "dark"];
  return (
    <Tabs
      screenOptions={{
        headerTintColor: theme.text,
        headerStyle: { backgroundColor: theme.navBackground },
        headerTitleStyle: { color: theme.title },
        headerTitleContainerStyle: styles.headerTitleContainer,
        tabBarInactiveTintColor: theme.icon,
        tabBarActiveTintColor: theme.iconFocused,
        tabBarStyle: { backgroundColor: theme.navBackground },
      }}
    >
      <Tabs.Screen
        name="radar"
        options={{
          title: "Radar",
          headerTitle: () => <TabHeader placeholder="Search destinations..." />,
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="mode-of-travel"
              size={24}
              color={focused ? theme.iconFocused : theme.icon}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="travelmates"
        options={{
          title: "Travelmates",
          headerTitle: () => <TabHeader placeholder="Search travelmates..." />,
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name="bag-personal-plus"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="postcards"
        options={{
          title: "Postcards",
          headerTitle: () => <TabHeader placeholder="Search postcards..." />,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="image" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="directs"
        options={{
          href: null,
          //title: "Directs",
          headerTitle: () => <TabHeader placeholder="Search postcards..." />,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="chatbox-ellipses" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="interests"
        options={{
          title: "Interests",
          headerTitle: () => <TabHeader placeholder="Search interests..." />,
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name="flower-tulip"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="trails"
        options={{
          title: "Trails",
          headerTitle: () => <TabHeader placeholder="Search trails..." />,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="footsteps" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerTitleContainer: {
    width: "100%",
    left: 0,
    right: 0,
  },
});
