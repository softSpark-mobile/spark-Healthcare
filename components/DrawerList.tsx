import React from "react";
import { 
  View, 
  Text, 
  Image, 
  Pressable, 
  StyleSheet 
} from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

const DrawerList: React.FC = () => {
  const router = useRouter();

  return (
    <DrawerContentScrollView contentContainerStyle={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <View style={styles.imageWrapper}>
          <Image
            source={require("@/assets/images/profile.png")} 
            style={styles.profileImage}
          />
        </View>
        <Text style={styles.userName}>John Doe</Text>
        <Text style={styles.userEmail}>johnjisiaj@gmail.com</Text>
      </View>

      {/* Drawer Items */}
      <View style={styles.menuContainer}>
        <MenuItem label="Dashboard" icon="grid" onPress={() => router.push("/(drawer)/(tabs)/(dashboardStack)")} />
        <MenuItem label="Notification" icon="bell" onPress={() => router.push("/(drawer)/(tabs)/(notificationStack)/notification")} />
        <MenuItem label="Activity" icon="bar-chart" onPress={() => router.push("/(drawer)/(tabs)/(activityStack)/activityScreen")} />
        <MenuItem label="Profile" icon="user" onPress={() => router.push("/(drawer)/(tabs)/(profilestack)/profile")} />
        <MenuItem label="Map" icon="map-pin" onPress={() => router.push("/nearbyhospital")} />
        <MenuItem label="Logout" icon="log-out" onPress={() => console.log("Logging Out")} isLogout />
      </View>
    </DrawerContentScrollView>
  );
};

// Reusable Menu Item Component
type MenuItemProps = {
  label: string;
  icon: string;
  onPress: () => void;
  isLogout?: boolean;
};

const MenuItem: React.FC<MenuItemProps> = ({ label, icon, onPress, isLogout = false }) => {
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.menuItem, 
        isLogout && styles.logoutButton,
        pressed && styles.pressed
      ]} 
      onPress={onPress}
    >
      <View style={styles.menuItemContent}>
        <Feather name={icon as any} size={22} style={[styles.menuIcon, isLogout && styles.logoutIcon]} />
        <Text style={[styles.menuText, isLogout && styles.logoutText]}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  imageWrapper: {
    position: "relative",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ddd",
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  userName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 14,
    color: "gray",
  },
  menuContainer: {
    paddingHorizontal: 20,
  },
  menuItem: {
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  pressed: {
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    marginRight: 12,
    color: "#000",
  },
  menuText: {
    fontSize: 16,
    fontWeight: "500",
  },
  logoutButton: {
    marginTop: 20,
  },
  logoutIcon: {
    color: "#FF6767",
  },
  logoutText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 20,
  },
});

export default DrawerList;
