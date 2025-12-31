import { radixColors } from "@/_constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

interface User {
  id: string;
  nickName: string;
  picture: string;
  online: boolean;
}

// Mock data - simulating fetched nearby users
const mockFetchNearbyUsers = (): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          nickName: "Surfgirl30",
          picture: "🏄‍♀️",
          online: true,
        },
        {
          id: "2",
          nickName: "Climber",
          picture: "🧗",
          online: false,
        },
        {
          id: "3",
          nickName: "dive-guide",
          picture: "🤿",
          online: true,
        },
        {
          id: "4",
          nickName: "flower lady",
          picture: "🌸",
          online: true,
        },
        {
          id: "5",
          nickName: "SunsetChaser",
          picture: "🌅",
          online: false,
        },
        {
          id: "6",
          nickName: "LetsRun",
          picture: "🏃‍♂️",
          online: true,
        },
        {
          id: "7",
          nickName: "YogaNomad",
          picture: "🧘‍♀️",
          online: false,
        },
        {
          id: "8",
          nickName: "FoodieExplorer",
          picture: "🍜",
          online: true,
        },
        {
          id: "9",
          nickName: "MountainKing",
          picture: "⛰️",
          online: true,
        },
        {
          id: "10",
          nickName: "BeachBum",
          picture: "🏖️",
          online: false,
        },
        {
          id: "11",
          nickName: "CityWanderer",
          picture: "🌆",
          online: true,
        },
        {
          id: "12",
          nickName: "NatureLover",
          picture: "🌲",
          online: false,
        },
        {
          id: "13",
          nickName: "SkiPro",
          picture: "⛷️",
          online: true,
        },
        {
          id: "14",
          nickName: "CoffeeLover",
          picture: "☕",
          online: false,
        },
        {
          id: "15",
          nickName: "BikeRider",
          picture: "🚴",
          online: true,
        },
        {
          id: "16",
          nickName: "StarGazer",
          picture: "⭐",
          online: true,
        },
        {
          id: "17",
          nickName: "CampMaster",
          picture: "⛺",
          online: false,
        },
        {
          id: "18",
          nickName: "WaveChaser",
          picture: "🌊",
          online: true,
        },
      ]);
    }, 500);
  });
};

export default function Radar() {
  const colorScheme = useColorScheme();
  const theme = radixColors[colorScheme ?? "light"];
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching nearby users
    mockFetchNearbyUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  const renderUser = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={[
        styles.userCard,
        {
          backgroundColor: theme.background[3],
          borderColor: theme.border[1],
        },
      ]}
      activeOpacity={0.7}
      onPress={() => router.push(`/directs`)}
    >
      <View style={styles.cardContent}>
        <View
          style={[
            styles.pictureContainer,
            { backgroundColor: theme.interactive[2] },
          ]}
        >
          <Text style={styles.picture}>{item.picture}</Text>
          <View
            style={[
              styles.onlineIndicator,
              {
                backgroundColor: item.online ? "#22c55e" : theme.border[2],
              },
            ]}
          />
        </View>
        <Text
          style={[styles.nickName, { color: theme.text[4] }]}
          numberOfLines={1}
        >
          {item.nickName}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <LinearGradient
        colors={[theme.background[4], theme.background[1]]}
        style={styles.container}
      >
        <Text style={{ color: theme.text[3] }}>Finding nearby users...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[theme.background[4], theme.background[1]]}
      style={styles.container}
    >
      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item.id}
        numColumns={3}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 8,
  },
  row: {
    paddingHorizontal: 8,
    marginBottom: 8,
    justifyContent: "space-evenly",
  },
  userCard: {
    width: 115,
    height: 115,
    borderRadius: 8,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
  pictureContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
    position: "relative",
  },
  picture: {
    fontSize: 24,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "white",
  },
  nickName: {
    fontSize: 10,
    fontWeight: "500",
    textAlign: "center",
  },
});
