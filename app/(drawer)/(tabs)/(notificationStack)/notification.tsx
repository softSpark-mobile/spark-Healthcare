import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "alert" | "reminder";
  read: boolean;
}

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Breakfast",
      message: "This is your breakfast time",
      time: "20m ago",
      type: "reminder",
      read: false,
    },
    {
      id: "2",
      title: "Lunch",
      message: "This is your lunch time",
      time: "1h ago",
      type: "reminder",
      read: true,
    },
    {
      id: "3",
      title: "Dinner",
      message: "This is your dinner time",
      time: "2h ago",
      type: "reminder",
      read: false,
    },
    {
      id: "4",
      title: "Morning Snack",
      message: "Time for a healthy morning snack",
      time: "30m ago",
      type: "reminder",
      read: true,
    },
    {
      id: "5",
      title: "Afternoon Snack",
      message: "Don't forget your afternoon snack",
      time: "3h ago",
      type: "reminder",
      read: false,
    },
    {
      id: "6",
      title: "Hydration",
      message: "Stay hydrated! Drink a glass of water",
      time: "10m ago",
      type: "alert",
      read: false,
    },
    {
      id: "7",
      title: "Workout Reminder",
      message: "Time for your daily workout session",
      time: "4h ago",
      type: "reminder",
      read: true,
    },
    {
      id: "8",
      title: "Medicine Reminder",
      message: "Take your prescribed medicine",
      time: "5h ago",
      type: "reminder",
      read: false,
    },
  ]);

  const [filter, setFilter] = useState<"all" | "unread" | "alert" | "reminder">(
    "all"
  );
  const [showDropdown, setShowDropdown] = useState(false);

  const removeNotification = (id: string, title: string) => {
    Alert.alert(
      "Are you sure?",
      `Do you really want to delete "${title}" notification?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
          },
        },
      ]
    );
  };

  const getTimeInMinutes = (time: string): number => {
    const num = parseInt(time);
    if (time.includes("h")) return num * 60;
    return num;
  };

  const sortedNotifications = [...notifications].sort(
    (a, b) => getTimeInMinutes(a.time) - getTimeInMinutes(b.time)
  );

  const filteredNotifications = sortedNotifications.filter((notification) => {
    if (filter === "unread") return !notification.read;
    if (filter === "alert") return notification.type === "alert";
    if (filter === "reminder") return notification.type === "reminder";
    return true; // 'all' filter
  });

  const handleSelectAll = () => {
    Alert.alert("Select All", "All notifications selected.");
    setShowDropdown(false);
  };

  const handleSelectMessage = () => {
    Alert.alert("Select Message", "Message selection functionality.");
    setShowDropdown(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "all" && styles.activeFilterButton,
          ]}
          onPress={() => setFilter("all")}
        >
          <Text
            style={
              filter === "all" ? styles.activeFilterText : styles.filterText
            }
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "unread" && styles.activeFilterButton,
          ]}
          onPress={() => setFilter("unread")}
        >
          <Text
            style={
              filter === "unread" ? styles.activeFilterText : styles.filterText
            }
          >
            Unread
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "alert" && styles.activeFilterButton,
          ]}
          onPress={() => setFilter("alert")}
        >
          <Text
            style={
              filter === "alert" ? styles.activeFilterText : styles.filterText
            }
          >
            Alert
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "reminder" && styles.activeFilterButton,
          ]}
          onPress={() => setFilter("reminder")}
        >
          <Text
            style={
              filter === "reminder"
                ? styles.activeFilterText
                : styles.filterText
            }
          >
            Reminder
          </Text>
        </TouchableOpacity>

        {/* Three-dot icon for dropdown */}
        <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)}>
          <Entypo name="dots-three-vertical" size={20} color="black" />
        </TouchableOpacity>
      </View>

      {/* Dropdown (Absolute Positioning) */}
      {showDropdown && (
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={handleSelectMessage}
          >
            <Text>Select Message</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={handleSelectAll}
          >
            <Text>Select All</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationWrapper}>
            <View
              style={[styles.notificationItem, { width: screenWidth - 70 }]}
            >
              <View>
                <Text style={[styles.title, !item.read && styles.unreadTitle]}>
                  {item.title}
                </Text>
                <Text style={styles.message}>{item.message}</Text>
              </View>
              <Text style={styles.time}>{item.time}</Text>
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeNotification(item.id, item.title)}
            >
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 16,
    position: "relative", // Required for absolute positioning of dropdown
  },
  filterButton: {
    // padding: 8,
    paddingRight: 20,
    paddingLeft: 20,
    paddingBottom: 8,
    paddingTop: 8,
    borderRadius: 20,
  },
  activeFilterButton: {
    backgroundColor: "#DFEBF9",
  },
  filterText: {
    fontSize: 16,
    color: "#888",
  },
  activeFilterText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
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
  unreadTitle: {
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
  dropdownContainer: {
    position: "absolute",
    top: 40, // Adjust based on your layout
    right: 10, // Adjust based on your layout
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
    zIndex: 1, // Ensure dropdown is above other elements
  },
  dropdownItem: {
    padding: 8,
  },
});

export default NotificationScreen;
