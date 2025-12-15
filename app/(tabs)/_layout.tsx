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
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="mode-of-travel" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="postcards"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="image" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="travelmates"
        options={{
          headerShown: false,
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
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="footsteps" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="interests"
        options={{
          headerShown: false,
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
