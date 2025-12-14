import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="radar"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="mode-of-travel" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="postcards"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="flower" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="travelmates"
        options={{
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
        name="trails"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="footsteps" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="interests"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name="flower-tulip"
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
