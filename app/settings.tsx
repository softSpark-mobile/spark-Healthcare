import { useRouter } from "expo-router";
import React from "react";
import { Text, View, Pressable, StyleSheet } from "react-native";
import { FontAwesome, Feather, FontAwesome5 } from "@expo/vector-icons";

const Settings = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* My Account Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <FontAwesome5 name="user-alt" size={20} color="black" />
          <Text style={styles.headerText}>My Account</Text>
        </View>
        <Pressable
          style={styles.item}
          onPress={() => console.log("Update Profile")}
        >
          <Text style={styles.itemText}>Update Profile</Text>
        </Pressable>
        <Pressable style={styles.item} onPress={() => console.log("Contacts")}>
          <Text style={styles.itemText}>Contacts</Text>
        </Pressable>
      </View>

      {/* Edit Onboarding Details Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Feather name="settings" size={20} color="black" />
          <Text style={styles.headerText}>Edit onboarding Details</Text>
        </View>
        <Pressable
          style={styles.item}
          onPress={() => router.push("/updatePersonal")}
        >
          <Text style={styles.itemText}>Personal Data</Text>
        </Pressable>
        <Pressable
          style={styles.item}
          onPress={() => router.push("/updateHealthData")}
        >
          <Text style={styles.itemText}>Health</Text>
        </Pressable>
        <Pressable
          style={styles.item}
          onPress={() => router.push("/updateHealthHistory")}
        >
          <Text style={styles.itemText}>Health History</Text>
        </Pressable>
      </View>

      {/* Help Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Feather name="help-circle" size={20} color="black" />
          <Text style={styles.headerText}>Help</Text>
        </View>
        <Pressable style={styles.item} onPress={() => console.log("About Us")}>
          <Text style={styles.itemText}>About us</Text>
        </Pressable>
        <Pressable
          style={styles.item}
          onPress={() => console.log("Contact Us")}
        >
          <Text style={styles.itemText}>Contact us</Text>
        </Pressable>
        <Pressable
          style={styles.item}
          onPress={() => console.log("Privacy Policy")}
        >
          <Text style={styles.itemText}>Privacy policy</Text>
        </Pressable>
      </View>

      {/* Logout Section */}
      <View style={styles.section}>
        <Pressable style={styles.logout} onPress={() => console.log("Logout")}>
          <Feather name="log-out" size={16} color="red" />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  section: {
    backgroundColor: "#f6f6f6",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
    color: "#000",
  },
  item: {
    paddingVertical: 8,
    paddingLeft: 20,
  },
  itemText: {
    fontSize: 14,
    color: "#00318D",
    fontWeight: "900",
  },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    paddingVertical: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 6,
    color: "#000000",
  },
});

export default Settings;
