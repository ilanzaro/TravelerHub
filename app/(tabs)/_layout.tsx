import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Tabs } from "expo-router";
import TabHeader from "../../components/TabHeader";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="radar"
        options={{
          title: "Radar",
          headerTitle: () => <TabHeader placeholder="Search destinations..." />,
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="mode-of-travel" size={24} color={color} />
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
          title: "Directs",
          headerShown: false,
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
