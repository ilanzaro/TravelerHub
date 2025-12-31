import { radixColors } from "@/_constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

interface Message {
  id: string;
  from: string;
  text: string;
  read: boolean;
  timestamp: Date;
}

// Mock data - simulating fetched messages
const mockFetchMessages = (): Promise<Message[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          from: "Surfgirl30",
          text: "Hey! Did you get my photos from Barcelona? The Sagrada Familia was absolutely stunning!",
          read: false,
          timestamp: new Date(2025, 11, 31, 10, 30),
        },
        {
          id: "2",
          from: "Climber",
          text: "Thanks for the travel tips! I'm booking my flight to Tokyo next week.",
          read: true,
          timestamp: new Date(2025, 11, 30, 15, 45),
        },
        {
          id: "3",
          from: "dive-guide",
          text: "Are you still up for the hiking trip in the Alps? I found an amazing trail!",
          read: false,
          timestamp: new Date(2025, 11, 30, 9, 20),
        },
        {
          id: "4",
          from: "flower lady",
          text: "Just landed in Paris! The weather is perfect for exploring the city.",
          read: true,
          timestamp: new Date(2025, 11, 29, 18, 10),
        },
        {
          id: "5",
          from: "SunsetChaser",
          text: "I loved your postcard recommendations! Adding them all to my travel list.",
          read: true,
          timestamp: new Date(2025, 11, 29, 12, 0),
        },
        {
          id: "6",
          from: "LetsRun",
          text: "Hey, do you have any restaurant recommendations in Rome? Planning my itinerary now.",
          read: false,
          timestamp: new Date(2025, 11, 28, 20, 30),
        },
        {
          id: "7",
          from: "YogaNomad",
          text: "Thanks for connecting! Would love to hear more about your trip to Iceland.",
          read: true,
          timestamp: new Date(2025, 11, 28, 14, 15),
        },
      ]);
    }, 500);
  });
};

export default function Directs() {
  const colorScheme = useColorScheme();
  const theme = radixColors[colorScheme ?? "light"];
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching messages
    mockFetchMessages().then((data) => {
      setMessages(data);
      setLoading(false);
    });
  }, []);

  const truncateText = (text: string, maxLength: number = 60) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const renderEnvelope = (read: boolean) => {
    return (
      <View style={styles.envelopeContainer}>
        <Text style={styles.envelope}>
          <Ionicons
            name={read ? "mail-open" : "mail"}
            size={20}
            color={theme.solid[2]}
          />
        </Text>
      </View>
    );
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <TouchableOpacity
      style={[
        styles.messageRow,
        {
          backgroundColor: item.read
            ? theme.background[2]
            : theme.background[3],
          borderBottomColor: theme.border[1],
        },
      ]}
      activeOpacity={0.7}
    >
      {renderEnvelope(item.read)}
      <View style={styles.messageContent}>
        <Text
          style={[
            styles.senderName,
            {
              color: theme.text[4],
              fontWeight: item.read ? "normal" : "bold",
            },
          ]}
        >
          {item.from}
        </Text>
        <Text
          style={[
            styles.messagePreview,
            {
              color: item.read ? theme.text[3] : theme.text[4],
              fontWeight: item.read ? "normal" : "500",
            },
          ]}
        >
          {truncateText(item.text)}
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
        <Text style={{ color: theme.text[3] }}>Loading directs...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[theme.background[4], theme.background[1]]}
      style={styles.container}
    >
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
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
    paddingTop: 8,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    minHeight: 80,
  },
  envelopeContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  envelope: {
    fontSize: 28,
  },
  messageContent: {
    flex: 1,
    justifyContent: "center",
  },
  senderName: {
    fontSize: 16,
    marginBottom: 4,
  },
  messagePreview: {
    fontSize: 14,
    lineHeight: 20,
  },
});
