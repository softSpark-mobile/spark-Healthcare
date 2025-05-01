import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable, StyleSheet, Alert } from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useFocusEffect, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/components/Redux/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootState } from "./Redux/store";
import axios from "axios";
import { BackendUrl } from "@/constants/backendUrl";
const DrawerList: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const authss = useSelector((state: RootState) => state.auth);
  const userData = useSelector((state: RootState) => state.auth);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  useFocusEffect(() => {
    fetchUserProfile();
  });

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        `${BackendUrl}/api/user/getUserByUserId/${userData.userId}`,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      console.log(response?.data.data, "userData");

      // setProfilePicture(user.profileImage || null);
      setName(response?.data.data.Name || "");
      setEmail(response?.data.data.Email || "");
      if (response?.data.data.profilePhoto) {
        setProfilePicture(`${BackendUrl}/${response.data.data.profilePhoto}`);
      }
      console.log(profilePicture, "profile");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to fetch profile"
      );
      console.error("Profile fetch error:", error);
    } finally {
    }
  };

  const handleLogout = () => {
    console.log(authss);

    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("token");
          dispatch(logout()); // Clears token, isAuthenticated, etc.
          console.log(dispatch(logout()), "hhhhhh");
        },
      },
    ]);
  };

  return (
    <DrawerContentScrollView contentContainerStyle={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <View style={styles.imageWrapper}>
          <Image
            source={
              profilePicture
                ? { uri: profilePicture }
                : require("@/assets/images/profile.png")
            }
            style={styles.profileImage}
          />
        </View>
        <Text style={styles.userName}>{name}</Text>
        <Text style={styles.userEmail}>{email}</Text>
      </View>

      {/* Drawer Items */}
      <View style={styles.menuContainer}>
        <MenuItem
          label="Dashboard"
          icon="grid"
          onPress={() => router.push("/(drawer)/(tabs)/(dashboardStack)")}
        />
        <MenuItem
          label="Notification"
          icon="bell"
          onPress={() =>
            router.push("/(drawer)/(tabs)/(notificationStack)/notification")
          }
        />
        <MenuItem
          label="Activity"
          icon="bar-chart"
          onPress={() =>
            router.push("/(drawer)/(tabs)/(activityStack)/activityScreen")
          }
        />
        <MenuItem
          label="Profile"
          icon="user"
          onPress={() => router.push("/(drawer)/(tabs)/(profilestack)/profile")}
        />
        <MenuItem
          label="Map"
          icon="map-pin"
          onPress={() => router.push("/nearbyhospital")}
        />
        <MenuItem
          label="Logout"
          icon="log-out"
          onPress={() => handleLogout()}
          isLogout
        />
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

const MenuItem: React.FC<MenuItemProps> = ({
  label,
  icon,
  onPress,
  isLogout = false,
}) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.menuItem,
        isLogout && styles.logoutButton,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.menuItemContent}>
        <Feather
          name={icon as any}
          size={22}
          style={[styles.menuIcon, isLogout && styles.logoutIcon]}
        />
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
