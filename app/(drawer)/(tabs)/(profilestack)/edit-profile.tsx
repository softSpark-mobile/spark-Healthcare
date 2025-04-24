import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/components/Redux/store";
import { BackendUrl } from "@/constants/backendUrl";
import axios from "axios";
import { Platform } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface PersonalData {
  PhoneNo?: string;
  CountryCode?: string;
  Country?: string;
  State?: string;
  Address?: string;
  Gender?: string;
  DOB?: string;
  LastName?: string;
  Email?: string;
  FirstName?: string;
  coverPhoto?: string;
  profilePhoto?: string;
}

const EditProfile: React.FC = () => {
  const userData = useSelector((state: RootState) => state.auth);
  const [firstname, setFirstName] = useState<string>(userData.name || "");
  const [lastname, setLastName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [email, setEmail] = useState<string>(userData.email || "");
  const [dob, setDob] = useState<string>("1990-01-01");
  const [phone, setPhone] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string | null>(
    userData.profilePhoto || null
  );
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<PersonalData | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  useEffect(() => {
    fetchUserData();
    requestMediaPermissions();
  }, []);

  const requestMediaPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "We need camera roll permissions to upload images"
      );
    }
  };

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${BackendUrl}/api/user/getUserByUserId/${userData.userId}`,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.data) {
        const userData = response.data.data;
        setFormValues(userData);
        setFirstName(userData.FirstName || "");
        setLastName(userData.LastName || "");
        setAddress(userData.Address || "");
        setPhone(userData.PhoneNo?.toString() || "");
        setProfileImage(userData.profilePhoto || null);
        setCoverImage(userData.coverPhoto || null);
        setDob(userData.DOB || "1990-01-01");
      }
    } catch (error :any) {

      console.error("Error fetching user data:", error.response);
      Alert.alert("Error", "Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0];
    setDob(formattedDate);
    hideDatePicker();
  };

  const handleImagePick = async (
    source: "camera" | "gallery",
    type: "profile" | "cover"
  ) => {
    try {
      let result;
      if (source === "camera") {
        result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: type === "cover" ? [16, 9] : [1, 1],
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: type === "cover" ? [16, 9] : [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets && result.assets[0].uri) {
        const uri = result.assets[0].uri;
        if (type === "profile") {
          setProfileImage(uri);
        } else {
          setCoverImage(uri);
        }
      }
    } catch (error: any) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to select image");
    }
  };

  const showImagePickerOptions = (type: "profile" | "cover") => {
    Alert.alert(
      "Select Image",
      "Choose an option",
      [
        { text: "Camera", onPress: () => handleImagePick("camera", type) },
        { text: "Gallery", onPress: () => handleImagePick("gallery", type) },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const updateProfile = async () => {
    try {
      setIsLoading(true);

      const formData = new FormData();

      // Append all text fields
      formData.append("FirstName", firstname);
      formData.append("LastName", lastname);
      formData.append("DOB", dob);
      formData.append("Address", address);
      formData.append("PhoneNo", phone);
      formData.append("userId", userData.userId);

      // Handle profile photo
      if (profileImage && profileImage !== formValues?.profilePhoto) {
        const localUri = profileImage;
        const filename = localUri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename || "");
        const type = match ? `image/${match[1]}` : "image/jpeg";

        formData.append("profilePhoto", {
          uri:
            Platform.OS === "android"
              ? localUri.replace("file://", "")
              : localUri,
          name: filename || `profile-${Date.now()}.jpg`,
          type,
        } as any);
      } else if (formValues?.profilePhoto) {
        // If no new image but existing one, send the URL
        formData.append("profilePhoto", formValues.profilePhoto);
      }

      // Handle cover photo
      if (coverImage && coverImage !== formValues?.coverPhoto) {
        const localUri = coverImage;
        const filename = localUri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename || "");
        const type = match ? `image/${match[1]}` : "image/jpeg";

        formData.append("coverPhoto", {
          uri:
            Platform.OS === "android"
              ? localUri.replace("file://", "")
              : localUri,
          name: filename || `cover-${Date.now()}.jpg`,
          type,
        } as any);
      } else if (formValues?.coverPhoto) {
        // If no new image but existing one, send the URL
        formData.append("coverPhoto", formValues.coverPhoto);
      }
      console.log(formData,'---------------------');
      
      // Make the request
      const response = await axios.put(
        `${BackendUrl}/api/user/UpdateUserValues`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
            "Content-Type": "multipart/form-data",
          },
          transformRequest: (data) => data,
          timeout: 30000,
        }
      );

      if (response.data.success) {
        Alert.alert("Success", "Profile updated successfully");
        router.push("/(drawer)/(tabs)/(profilestack)/profile");
      } else {
        throw new Error(response.data.message || "Update failed");
      }
    } catch (error:any) {
      console.error("Update error:", error.response.status);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !formValues) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00318D" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Cover Photo */}
        <TouchableOpacity
          style={styles.coverContainer}
          onPress={() => showImagePickerOptions("cover")}
          disabled={isLoading}
        >
          <Image
            source={
              coverImage
                ? { uri: coverImage }
                : formValues?.coverPhoto
                ? { uri: formValues.coverPhoto }
                : require("@/assets/images/placeholder.png")
            }
            style={styles.coverImage}
          />
          <View style={styles.coverCameraIconContainer}>
            <Ionicons name="camera" size={24} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Profile Picture */}
        <View style={styles.profilePictureContainer}>
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : formValues?.profilePhoto
                ? { uri: formValues.profilePhoto }
                : require("@/assets/images/profile.png")
            }
            style={styles.profileImage}
          />
          <TouchableOpacity
            style={styles.profileCameraIconContainer}
            onPress={() => showImagePickerOptions("profile")}
            disabled={isLoading}
          >
            <Ionicons name="camera" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Profile Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={firstname}
            onChangeText={setFirstName}
            editable={!isLoading}
          />

          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={lastname}
            onChangeText={setLastName}
            editable={!isLoading}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={email}
            onChangeText={setEmail}
            editable={false}
          />

          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity onPress={showDatePicker}>
            <TextInput
              style={styles.input}
              value={dob}
              onChangeText={setDob}
              editable={false}
              placeholder="YYYY-MM-DD"
            />
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            maximumDate={new Date()}
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            editable={!isLoading}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.addressInput}
            value={address}
            onChangeText={setAddress}
            editable={!isLoading}
            multiline
          />

          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.disabledButton]}
            onPress={updateProfile}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  coverContainer: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    backgroundColor: "#f0f0f0",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  coverCameraIconContainer: {
    position: "absolute",
    bottom: 15,
    right: 15,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 20,
    padding: 8,
  },
  profilePictureContainer: {
    position: "absolute",
    top: 150,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#fff",
    backgroundColor: "#f0f0f0",
  },
  profileCameraIconContainer: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 15,
    padding: 5,
  },
  detailsContainer: {
    marginTop: 70,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#333",
  },
  addressInput: {
    height: 100,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    textAlignVertical: "top",
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#333",
  },
  disabledInput: {
    backgroundColor: "#f5f5f5",
    color: "#888",
  },
  saveButton: {
    backgroundColor: "#00318D",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 25,
    marginBottom: 15,
  },
  disabledButton: {
    backgroundColor: "#85a3e0",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EditProfile;