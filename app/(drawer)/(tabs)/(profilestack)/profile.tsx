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
import axios from "axios";
import { router, useFocusEffect } from "expo-router";
import { BackendUrl } from "@/constants/backendUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { CustomJwtPayload } from "@/app/personalData";
import { useSelector } from "react-redux";
import { RootState } from "@/components/Redux/store";

const ProfileScreen: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [dob, setDob] = useState<string>("");
  const [age, setAge] = useState<number>(0);
  const [country, setCountry] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<string>("");
  const [coverImage, setCoverImage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const userData = useSelector((state: RootState) => state.auth);

  useFocusEffect(
    React.useCallback(() => {
      getUserProfile();
    }, [])
  );

  const getUserProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BackendUrl}/api/user/getUserByUserId/${userData.userId}`,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      const user = response?.data.data;
      setName(user.Name);
      setEmail(user.Email);

      if (user.DOB) {
        const formattedDob = user.DOB.split("T")[0];
        setDob(formattedDob);
      }

      setAge(user.Age || 0);
      setCountry(user.Country);
      setState(user.State);

      if (user.profilePhoto) {
        setProfileImage(`${BackendUrl}/${user.profilePhoto}`);
        console.log(profileImage, "profile image");
      }
      if (user.coverPhoto) {
        setCoverImage(`${BackendUrl}/${user.coverPhoto}`);
      }
    } catch (error: any) {
      console.error("Error fetching user profile:", error);
      Alert.alert("Error", "Failed to fetch user profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00318D" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Cover Photo */}
        <View style={styles.coverContainer}>
          {coverImage ? (
            <Image
              source={{ uri: coverImage }}
              style={styles.coverImage}
              resizeMode="cover"
            />
          ) : (
            <Image
              source={require("@/assets/images/placeholder.png")}
              style={styles.coverImage}
              resizeMode="cover"
            />
          )}
        </View>

        {/* Profile Picture */}
        <View style={styles.profilePictureContainer}>
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={styles.profileImage}
              resizeMode="cover"
            />
          ) : (
            <Image
              source={require("@/assets/images/profile.png")}
              style={styles.profileImage}
              resizeMode="cover"
            />
          )}
        </View>

        {/* Profile Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            editable={isEditing}
            placeholder="Enter your name"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            editable={isEditing}
            placeholder="Enter your email"
          />

          <Text style={styles.label}>Date of Birth</Text>
          <TextInput
            style={styles.input}
            value={dob}
            onChangeText={setDob}
            editable={isEditing}
            placeholder="YYYY-MM-DD"
          />

          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            value={age.toString()}
            onChangeText={(text) => setAge(Number(text) || 0)}
            editable={isEditing}
            placeholder="Age"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Country</Text>
          <TextInput
            style={styles.input}
            value={country}
            onChangeText={setCountry}
            editable={isEditing}
            placeholder="Enter your country"
          />

          <Text style={styles.label}>State</Text>
          <TextInput
            style={styles.input}
            value={state}
            onChangeText={setState}
            editable={isEditing}
            placeholder="Enter your state"
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => router.push("/updatePersonal")}
            >
              <Text style={styles.saveButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
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
  coverContainer: {
    width: "100%",
    height: 200,
    backgroundColor: "#f0f0f0",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  profilePictureContainer: {
    position: "absolute",
    top: 150,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#fff",
    backgroundColor: "#f0f0f0",
  },
  detailsContainer: {
    marginTop: 70,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    color: "#333",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: "#00318D",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
    elevation: 2,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
