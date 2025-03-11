import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  LogBox,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../components/Redux/store";
import { goToOnboardingTwo, login } from "../components/Redux/authSlice";
import * as DocumentPicker from "expo-document-picker";
// import {CountryPicker} from "react-native-country-codes-picker";
import axios from "axios";
// import ListHeaderComponent from "@/components/PhoneNumber"
import { Icon } from "react-native-paper";
import { BackendUrl } from "@/constants/backendUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import PhoneInput from "react-native-phone-number-input";

// Suppress unnecessary warnings
LogBox.ignoreLogs([
  "Support for defaultProps will be removed from function components",
]);

export default function updatePersonal(): JSX.Element {
  const dispatch: AppDispatch = useDispatch();
//   const userData = useSelector((state) => state.auth);
//   console.log(userData, "userVlauess");
  const [fullName, setFullName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState<boolean>(false);
  const [gender, setGender] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [selectedFile, setSelectedFile] =
    useState<DocumentPicker.DocumentPickerResult>();

  //phone Number
  const [countryCode, setCountryCode] = useState<CountryCode>("IN"); // Default: India
  const [callingCode, setCallingCode] = useState<string>("91"); // Default: +91
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const phoneInputRef = useRef<TextInput>(null);

  const [fileUri, setFileUri] = useState("");

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled) {
        Alert.alert("Cancelled", "Document selection was cancelled.");
        return;
      }

      if (!result.canceled) {
        setFileUri(result.assets[0].uri);
      }

      if (!result.assets || result.assets.length === 0) {
        Alert.alert("Error", "No file selected.");
        return;
      }

      setSelectedFile(result);
      Alert.alert("Success", "Document selected successfully.");
    } catch (error) {
      Alert.alert("Error", "Failed to pick document.");
    }
  };

  const handleConfirm = (date: Date) => {
    setDateOfBirth(date);
    setDatePickerVisible(false);
  };

  const handleSubmit = async () => {
    console.log("Calleddd");
    console.log(callingCode,phoneNumber,"------");
    
    // setOnboardingFlag(1);
    // try {
    //   const data = {
    //     Name: fullName,
    //     Age: age,
    //     DOB: dateOfBirth,
    //     Gender: gender,
    //     Address: address,
    //     District: district,
    //     State: state,
    //     Country: country,
    //     PhoneNo: countryCode + phoneNumber,
    //   };
    //   const formData = new FormData();
    //   console.log(formData, "before");
    //   for (const key in data) {
    //     formData.append(key, data[key].toString());
    //   }
    //   console.log(formData, "after");

    //   formData.append("UserDocument", {
    //     uri: selectedFile?.assets[0].uri,
    //     type: selectedFile?.assets[0].mimeType,
    //     name: selectedFile?.assets[0].name,
    //   });

    //   const response = await axios.put(
    //     `${BackendUrl}/api/user/UpadateUserValues`,
    //     formData,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${userData.token}`,
    //         "Content-Type": "multipart/form-data",
    //       },
    //     }
    //   );
    //   console.log(response.data, "DataFlow");
    //   if (response.status === 200) {
    //     // await AsyncStorage.setItem("token", response.data.data);
    //     // dispatch(login(response.data.data));
    //     setOnboardingFlag(1);
    //   }
    // } catch (error) {
    //   console.log(error, "error");
    // }
    // setOnboardingFlag(1);
  };
  console.log(selectedFile, "fileVluesss");
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Personal / General</Text>

        {/* Full Name */}
        <Text style={styles.label}>Preferred Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          placeholderTextColor="black"
          autoCapitalize="words"
          value={fullName}
          onChangeText={setFullName}
        />

        {/* Age */}
        <Text style={styles.label}>How old are you?</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your age"
          placeholderTextColor="black"
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
        />

        {/* Gender Selection with Tick Mark */}
        <Text style={styles.label}>Gender</Text>
        <View style={styles.genderContainer}>
          {["Male", "Female", "Others"].map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.genderButton,
                gender === option && styles.genderButtonSelected,
              ]}
              onPress={() => setGender(option)}
            >
              <Text style={styles.genderText}>
                {option} {gender === option ? "✔" : ""}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Date of Birth */}
        <Text style={styles.label}>Date of Birth</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setDatePickerVisible(true)}
        >
          <Text style={{ color: "black", fontSize: 16 }}>
            {dateOfBirth
              ? dateOfBirth.toDateString()
              : "Select your date of birth"}
          </Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={() => setDatePickerVisible(false)}
        />

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          placeholderTextColor="black"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        {/* Country-phone number */}
        <View>
          <Text style={styles.label}>Enter Phone Number:</Text>
          <View style={styles.inputContainer}>
            {/* Country Picker */}
            <TouchableOpacity
              style={styles.countryPicker}
              onPress={() => phoneInputRef.current?.focus()}
            >
              <CountryPicker
                withCallingCode
                withFlag
                withFilter
                withModal
                countryCode={countryCode}
                onSelect={(selectedCountry: Country) => {
                  setCountryCode(selectedCountry.cca2 as CountryCode);
                  setCallingCode(selectedCountry.callingCode?.[0] || callingCode);
                }}
              />
              <Text style={styles.callingCode}>+{callingCode}</Text>
            </TouchableOpacity>

            {/* Phone Number Input */}
            <TextInput
              ref={phoneInputRef}
              style={styles.phoneInput}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>
        </View>

        {/* Address */}
        <Text style={styles.label}>Address</Text>
        <TextInput
          value={address}
          onChangeText={setAddress}
          placeholder="Enter your address"
          placeholderTextColor="black"
          multiline
          numberOfLines={4}
          style={[styles.textArea, { backgroundColor: '#FFFFFF' }]}
        />

        {/* Country */}
        <Text style={styles.label}>Where do you live?</Text>
        <TextInput
          value={country}
          onChangeText={setCountry}
          placeholder="Enter your country"
          placeholderTextColor="black"
          style={styles.input}
        />

        {/* State */}
        <Text style={styles.label}>State</Text>
        <TextInput
          value={state}
          onChangeText={setState}
          placeholder="Enter your state"
          placeholderTextColor="black"
          style={styles.input}
        />

        {/* District */}
        <Text style={styles.label}>District</Text>
        <TextInput
          value={district}
          onChangeText={setDistrict}
          placeholder="Enter your district"
          placeholderTextColor="black"
          style={styles.input}
        />

        {/* Document Upload */}
        {/* <View>
          <Text style={styles.label}>Upload Aadhaar or License</Text>
          <TouchableOpacity onPress={pickDocument} style={styles.uploadButton}>
            <Text style={styles.uploadButtonText}>Choose File</Text>
          </TouchableOpacity>

          
          {fileUri ? (
            <View style={styles.uploadedFileContainer}>
              <Text style={styles.uploadedFileName}>
                {selectedFile?.assets[0].name}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setSelectedFile(undefined);
                  setFileUri("");
                }}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View> */}

        {/* Next Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => handleSubmit()}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#def1f8", padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "black",
  },
  label: { fontSize: 16, fontWeight: "600", marginTop: 20, color: "black" },
  input: {
    borderWidth: 1,
    borderColor: "#FFFFFF",
    backgroundColor: "#FFFFFF",
    padding: 10,
    // marginBottom: 15,
    borderRadius: 10,
    color: "black",
    marginTop:10,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
    marginTop:10,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    padding: 10,
    borderRadius: 10,
    color: "black",
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 0,
    marginTop:10,
  },
  genderButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    marginHorizontal: 5,
    height: 50,
  },
  genderButtonSelected: { backgroundColor: "#3ECD7E" },
  genderText: { color: "black", fontSize: 16 },
  uploadButton: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  uploadButtonText: { color: "black", fontSize: 16, fontWeight: "bold" },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 70,
  },
  nextButton: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "70%",
  },
  nextButtonText: { color: "black", fontSize: 18, fontWeight: "bold" },

  // Phone Number
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 8,
    padding: 5,
    backgroundColor: "#FFFFFF",
    marginTop:10,
  },
  countryPicker: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  callingCode: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
  },

  // Document
  uploadedFileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "00FFFFFF",
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 10,
  },
  uploadedFileName: {
    fontSize: 16,
    color: "black",
  },
  removeButton: {
    backgroundColor: "#3ECD7E",
    padding: 8,
    borderRadius: 5,
  },
  removeButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});
