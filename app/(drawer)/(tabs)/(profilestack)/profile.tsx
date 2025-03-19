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
import { router } from "expo-router";

const ProfileScreen: React.FC = () => {
  const [name, setName] = useState<string>("John Doe");
  const [email, setEmail] = useState<string>("johndoe@example.com");
  const [password, setPassword] = useState<string>("********");
  const [dob, setDob] = useState<string>("1990-01-01");
  const [country, setCountry] = useState<string>("United States");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);

 

  return (
    <View style={styles.container}>
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
            onPress={() => router.push('/edit-profile')}
          >
            <Text style={styles.saveButtonText}>
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  coverContainer: { 
    width: "100%", 
    height: 150, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  coverImage: { 
    width: "100%", 
    height: "100%", 
    resizeMode: "cover" 
  },
  profilePictureContainer: {
    position: "absolute",
    top: 85, // Adjust this value to position the profile picture correctly
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
    paddingHorizontal: 20 
  },
  label: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#000", 
    marginTop: 10 
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
    width: "80%",
  },
  saveButtonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
});

export default ProfileScreen;