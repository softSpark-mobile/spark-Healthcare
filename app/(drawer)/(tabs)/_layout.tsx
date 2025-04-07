import { Tabs } from "expo-router";
import { View, StyleSheet } from "react-native";
import { FontAwesome, Ionicons, Entypo, MaterialIcons } from "@expo/vector-icons";
import AntDesign from '@expo/vector-icons/AntDesign';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false, // Hide tab labels
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="(dashboardStack)"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrapper, focused && styles.activeTab]}>
              <AntDesign name="appstore-o" size={24} color={focused ? "#FFFFFF" : "#000000"} />
            </View>
          ),
        }}
      />

      {/* Activity Tab */}
      <Tabs.Screen
        name="(activityStack)"
        options={{
          title: "Activity",
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrapper, focused && styles.activeTab]}>
              <MaterialIcons name="food-bank" size={40} color={focused ? "#FFFFFF" : "#000000"} />
            </View>
          ),
        }}
      />

      {/* Notification Tab */}
      <Tabs.Screen
        name="(notificationStack)"
        options={{
          title: "Notification",
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrapper, focused && styles.activeTab]}>
              <Ionicons name="notifications-outline" size={30} color={focused ? "#FFFFFF" : "#000000"} />
            </View>
          ),
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="(profilestack)"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrapper, focused && styles.activeTab]}>
              <Entypo name="user" size={30} color={focused ? "#FFFFFF" : "#000000"} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "white",
    height: 55, // Set fixed height
    borderTopWidth: 0,
    shadowOffset: { width: 0, height: 5 },
    alignItems: "center", // Center tab items vertically
    justifyContent: "center", // Center tab items horizontally
  },
  iconWrapper: {
    width: 60, // Define a fixed square size
    height: 50, // Keep it square
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20, // Rounded corners for the square
    marginTop: 15,
  },
  activeTab: {
    backgroundColor: "#3ECD7E", // Green background when active
  },
});
