import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

const ProfileScreen: React.FC = () => {
  const [name, setName] = useState<string>("John Doe");
  const [email, setEmail] = useState<string>("johndoe@example.com");
  const [password, setPassword] = useState<string>("********");
  const [dob, setDob] = useState<string>("1990-01-01");
  const [country, setCountry] = useState<string>("United States");
  const [isEditing, setIsEditing] = useState<boolean>(false);
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
        aspect: [16, 9], // For cover image aspect ratio
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [16, 9], // For cover image aspect ratio
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
      {/* Cover Photo (Click to change) */}
      <TouchableOpacity onPress={() => showImagePickerOptions("cover")}>
        <View style={styles.coverContainer}>
          <Image
            source={
              coverImage
                ? { uri: coverImage }
                : require("@/assets/images/placeholder.png")
            }
            style={styles.coverImage}
          />
        </View>
      </TouchableOpacity>

      {/* Profile Picture */}
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
          style={styles.cameraIcon}
          onPress={() => showImagePickerOptions("profile")}
        >
          <Ionicons name="camera" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Profile Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          editable={isEditing}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          editable={isEditing}
        />

        <Text style={styles.label}>Date of Birth</Text>
        <TextInput
          style={styles.input}
          value={dob}
          onChangeText={setDob}
          editable={isEditing}
        />

        <Text style={styles.label}>Country/Region</Text>
        <TextInput
          style={styles.input}
          value={country}
          onChangeText={setCountry}
          editable={isEditing}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          editable={isEditing}
          secureTextEntry
        />

        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Text style={styles.saveButtonText}>
              {isEditing ? "Save Changes" : "Edit Profile"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  coverContainer: { width: "100%", height: 150 },
  coverImage: { width: "100%", height: "100%", resizeMode: "cover" },
  profilePictureContainer: {
    position: "absolute",
    top: 120,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: "#fff",
  },
  cameraIcon: {
    position: "absolute",
    right: 5,
    bottom: 5,
    backgroundColor: "#007bff",
    borderRadius: 20,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  detailsContainer: { marginTop: 80, paddingHorizontal: 20 },
  label: { fontSize: 16, fontWeight: "bold", color: "#000", marginTop: 10 },
  input: {
    backgroundColor: "transparent",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    color: "#000",
  },
  saveButton: {
    backgroundColor: "#3ECD7E",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
    width: "50%",
  },
  saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default ProfileScreen;
