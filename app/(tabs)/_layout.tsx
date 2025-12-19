import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Tabs, usePathname } from "expo-router";
import { StyleSheet, useColorScheme } from "react-native";
import TabHeader from "../../components/TabHeader";
import { Colors } from "../constants/colors";

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "dark"];
  const pathname = usePathname();
  const isDirectsRoute = pathname === "/directs";
  const chatboxColor = isDirectsRoute ? theme.iconFocused : theme.icon;

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
          headerTitle: () => (
            <TabHeader
              navIcon={
                <Ionicons
                  name="chatbox-ellipses"
                  size={24}
                  color={chatboxColor}
                />
              }
              placeholder="Search destinations..."
            />
          ),
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="mode-of-travel" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="travelmates"
        options={{
          title: "Travelmates",
          headerTitle: () => (
            <TabHeader
              navIcon={
                <Ionicons
                  name="chatbox-ellipses"
                  size={24}
                  color={chatboxColor}
                />
              }
              placeholder="Search travelmates..."
            />
          ),
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
          headerTitle: () => (
            <TabHeader
              navIcon={
                <Ionicons
                  name="chatbox-ellipses"
                  size={24}
                  color={chatboxColor}
                />
              }
              placeholder="Search postcards..."
            />
          ),
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
          headerTitle: () => (
            <TabHeader
              navIcon={
                <Ionicons
                  name="chatbox-ellipses"
                  size={24}
                  color={chatboxColor}
                />
              }
              placeholder="Search postcards..."
            />
          ),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="chatbox-ellipses" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="interests"
        options={{
          title: "Interests",
          headerTitle: () => (
            <TabHeader
              navIcon={
                <Ionicons
                  name="chatbox-ellipses"
                  size={24}
                  color={chatboxColor}
                />
              }
              placeholder="Search interests..."
            />
          ),
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
          headerTitle: () => (
            <TabHeader
              navIcon={
                <Ionicons
                  name="chatbox-ellipses"
                  size={24}
                  color={chatboxColor}
                />
              }
              placeholder="Search trails..."
            />
          ),
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
