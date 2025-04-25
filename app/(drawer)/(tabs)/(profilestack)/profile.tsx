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
  const [age, setAge] = useState<Number>(0);
  const [country, setCountry] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const userData = useSelector((state: RootState) => state.auth);

  useFocusEffect(() => {
    getUserProfile();
  });

  const getUserProfile = async () => {
    try {
      const response = await axios.get(
        `${BackendUrl}/api/user/getUserByUserId/${userData.userId}`,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      console.log("API Response:", response?.data.data.Age);
      setName(response?.data.data.Name);
      setEmail(response?.data.data.Email);
      // Format DOB to show only YYYY-MM-DD
      if (response?.data.data.DOB) {
        const formattedDob = response?.data.data.DOB.split("T")[0];
        setDob(formattedDob);
      }
      setAge(response?.data.data.Age || 0);
      setCountry(response?.data.data.Country);
      setState(response?.data.data.State);
      console.log(age, "age");
    } catch (error: any) {
      console.error(
        "Server responded with error status:",
        error.response?.status
      );
      console.error("Error data:", error.response?.data);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
      {/* Cover Photo (Click to change - Disabled) */}
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

      {/* Profile Picture (Click to change - Disabled) */}
      <View style={styles.profilePictureContainer}>
        <Image
          source={
            profileImage
              ? { uri: profileImage }
              : require("@/assets/images/profile.png")
          }
          style={styles.profileImage}
        />
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
          value={age.toString()} // Convert number to string
          onChangeText={(text) => setAge(Number(text) || 0)} // Convert back to number
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

        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => router.push('/updatePersonal')}
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
  container: { flex: 1, backgroundColor: "#fff" },
  coverContainer: {
    width: "100%",
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  profilePictureContainer: {
    position: "absolute",
    top: 85,
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
  detailsContainer: {
    marginTop: 50,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginTop: 10,
  },
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
    backgroundColor: "#00318D",
    padding: 15,
    borderRadius: 13,
    alignItems: "center",
    marginTop: 20,
    marginBottom:20,
    width: "80%",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
