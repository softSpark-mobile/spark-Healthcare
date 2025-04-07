import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const editProfile: React.FC = () => {
  const [name, setName] = useState<string>("John Doe");
  const [email, setEmail] = useState<string>("johndoe@example.com");
  const [password, setPassword] = useState<string>("********");
  const [dob, setDob] = useState<string>("1990-01-01");
  const [country, setCountry] = useState<string>("United States");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);

  // Function to pick an image from the gallery or camera
  const handleImagePick = async (
    source: "camera" | "gallery",
    type: "profile" | "cover"
  ) => {
    let result;
    if (source === "camera") {
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: type === "cover" ? [16, 9] : [1, 1], // Adjust aspect ratio based on image type
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: type === "cover" ? [16, 9] : [1, 1], // Adjust aspect ratio based on image type
        quality: 1,
      });
    }

    if (!result.canceled) {
      if (type === "profile") {
        setProfileImage(result.assets[0].uri);
      } else {
        setCoverImage(result.assets[0].uri);
      }
    }
  };

  // Show options when clicking on the camera icon
  const showImagePickerOptions = (type: "profile" | "cover") => {
    Alert.alert("Select Image", "Choose an option", [
      { text: "Camera", onPress: () => handleImagePick("camera", type) },
      { text: "Gallery", onPress: () => handleImagePick("gallery", type) },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Cover Photo (Click to change) */}
        <TouchableOpacity
          style={styles.coverContainer}
          onPress={() => showImagePickerOptions("cover")}
        >
          <Image
            source={
              coverImage
                ? { uri: coverImage }
                : require("@/assets/images/placeholder.png")
            }
            style={styles.coverImage}
          />
          <View style={styles.coverCameraIconContainer}>
            <Ionicons name="camera" size={24} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Profile Picture (Click to change) */}
        <View style={styles.profilePictureContainer}>
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : require("@/assets/images/profile.png")
            }
            style={styles.profileImage}
          />
          <TouchableOpacity
            style={styles.profileCameraIconContainer}
            onPress={() => showImagePickerOptions("profile")}
          >
            <Ionicons name="camera" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Profile Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Date of Birth</Text>
          <TextInput
            style={styles.input}
            value={dob}
            onChangeText={setDob}
          />

          <Text style={styles.label}>Country/Region</Text>
          <TextInput
            style={styles.input}
            value={country}
            onChangeText={setCountry}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => router.push("/(drawer)/(tabs)/(profilestack)/profile")} // Navigate to edit profile screen
            >
              <Text style={styles.editButtonText}>Save Change</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  coverContainer: {
    width: "100%",
    height: 170, // Increased height for better cover image visibility
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  coverCameraIconContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 8,
  },
  profilePictureContainer: {
    position: "absolute",
    top: 110, // Adjust this value to position the profile picture correctly
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#fff",
  },
  profileCameraIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 8,
  },
  detailsContainer: {
    marginTop: 30, // Adjusted margin to account for profile picture position
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginTop: 10,
  },
  input: {
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    color: "#000",
  },
  editButton: {
    backgroundColor: "#00318D",
    padding: 15,
    borderRadius: 13,
    alignItems: "center",
    marginTop: 20,
    width: "80%",
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default editProfile;
