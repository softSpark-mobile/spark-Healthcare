import { useState } from "react";
import { FlatList, StyleSheet, Text, View, Dimensions, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
}

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: "1", title: "Breakfast", message: "This is your breakfast time", time: "20m ago" },
    { id: "2", title: "Lunch", message: "This is your lunch time", time: "1h ago" },
    { id: "3", title: "Dinner", message: "This is your dinner time", time: "2h ago" },
    { id: "4", title: "Morning Snack", message: "Time for a healthy morning snack", time: "30m ago" },
    { id: "5", title: "Afternoon Snack", message: "Don't forget your afternoon snack", time: "3h ago" },
    { id: "6", title: "Hydration", message: "Stay hydrated! Drink a glass of water", time: "10m ago" },
    { id: "7", title: "Workout Reminder", message: "Time for your daily workout session", time: "4h ago" },
    { id: "8", title: "Medicine Reminder", message: "Take your prescribed medicine", time: "5h ago" },
  ]);

  // Function to remove a notification after confirmation
  const removeNotification = (id: string, title: string) => {
    Alert.alert(
      "Are you sure?", 
      `Do you really want to delete "${title}" notification?`, 
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        }},
      ]
    );
  };

  // Function to convert time string to minutes for sorting
  const getTimeInMinutes = (time: string): number => {
    const num = parseInt(time);
    if (time.includes("h")) return num * 60; // Convert hours to minutes
    return num; // Minutes remain as is
  };

  // Sort notifications in ascending order based on time
  const sortedNotifications = [...notifications].sort(
    (a, b) => getTimeInMinutes(a.time) - getTimeInMinutes(b.time)
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedNotifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationWrapper}>
            <View style={[styles.notificationItem, { width: screenWidth - 70 }]}>
              <View>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.message}>{item.message}</Text>
              </View>
              <Text style={styles.time}>{item.time}</Text>
            </View>
            <TouchableOpacity style={styles.removeButton} onPress={() => removeNotification(item.id, item.title)}>
              <Ionicons name="close" size={20} color="black" />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  notificationWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  notificationItem: {
    backgroundColor: "#CCE5FF80",
    padding: 16,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  removeButton: {
    padding: 8,
    marginLeft: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  message: {
    fontSize: 14,
    color: "#555",
  },
  time: {
    fontSize: 14,
    color: "#333",
  },
});

export default NotificationScreen;
