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
  ActivityIndicator,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../components/Redux/store";
import { goToOnboardingTwo, login } from "../components/Redux/authSlice";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import { Icon } from "react-native-paper";
import { BackendUrl } from "@/constants/backendUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import PhoneInput from "react-native-phone-number-input";
import Loader from "@/components/Loader";

// Suppress unnecessary warnings
LogBox.ignoreLogs([
  "Support for defaultProps will be removed from function components",
]);

interface OnboardingOneProps {
  setOnboardingFlag: (flag: number) => void;
}

// Loader Component
// const Loader = () => {
//   return (
//     <View style={styles.loaderContainer}>
//       <ActivityIndicator size="large" color="#0000ff" />
//     </View>
//   );
// };

export default function OnboardingOne({ setOnboardingFlag }: OnboardingOneProps): JSX.Element {
  const dispatch: AppDispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.auth);
  console.log(userData, "userValues");

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
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerResult | null>(null);

  // Phone Number
  const [countryCode, setCountryCode] = useState<CountryCode>("IN"); // Default: India
  const [callingCode, setCallingCode] = useState<string>("91"); // Default: +91
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const phoneInputRef = useRef<TextInput>(null);

  const [fileUri, setFileUri] = useState<string>("");

  // Error messages for each field
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    fullName: "",
    age: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    address: "",
    country: "",
    state: "",
    district: "",
    phoneNumber: "",
    document: "",
  });

  // Loader state
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate date of birth (not in the future)
  const validateDateOfBirth = (date: Date): boolean => {
    const currentDate = new Date();
    return date <= currentDate;
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!fullName) newErrors.fullName = "Full Name is required.";
    if (!age) newErrors.age = "Age is required.";
    if (!dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required.";
    if (dateOfBirth && !validateDateOfBirth(dateOfBirth)) {
      newErrors.dateOfBirth = "Date of Birth cannot be in the future.";
    }
    if (!gender) newErrors.gender = "Gender is required.";
    if (!email) newErrors.email = "Email is required.";
    if (email && !validateEmail(email)) newErrors.email = "Invalid email format.";
    if (!address) newErrors.address = "Address is required.";
    if (!country) newErrors.country = "Country is required.";
    if (!state) newErrors.state = "State is required.";
    if (!district) newErrors.district = "District is required.";
    if (!phoneNumber) newErrors.phoneNumber = "Phone Number is required.";
    if (!selectedFile) newErrors.document = "Document is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

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

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setFileUri(result.assets[0].uri);
        setSelectedFile(result);
        setErrors((prev) => ({ ...prev, document: "" })); // Clear document error
        Alert.alert("Success", "Document selected successfully.");
      } else {
        Alert.alert("Error", "No file selected.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick document.");
    }
  };

  const handleConfirm = (date: Date) => {
    if (!validateDateOfBirth(date)) {
      setErrors((prev) => ({ ...prev, dateOfBirth: "Date of Birth cannot be in the future." }));
      setDatePickerVisible(false); // Close the date picker
      return;
    }
    setDateOfBirth(date);
    setDatePickerVisible(false); // Close the date picker
    setErrors((prev) => ({ ...prev, dateOfBirth: "" })); // Clear date of birth error
  };

  const handleSubmit = async () => {
    if (!validateForm()) return; // Stop if validation fails

    setIsLoading(true); // Show loader

    try {
      const data = {
        Name: fullName,
        Age: age,
        DOB: dateOfBirth?.toISOString() || "",
        Gender: gender || "",
        Address: address,
        District: district,
        State: state,
        Country: country,
        PhoneNo: `${callingCode}${phoneNumber}`,
      };

      const formData = new FormData();
      for (const [key, value] of Object.entries(data)) {
        formData.append(key, value);
      }

      if (selectedFile?.assets && selectedFile.assets.length > 0) {
        formData.append("UserDocument", {
          uri: selectedFile.assets[0].uri,
          type: selectedFile.assets[0].mimeType || "application/octet-stream",
          name: selectedFile.assets[0].name || "file",
        });
      }

      const response = await axios.put(
        `${BackendUrl}/api/user/UpadateUserValues`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data, "DataFlow");
      if (response.status === 200) {
        setOnboardingFlag(1);
      }
    } catch (error) {
      console.log(error, "error");
      Alert.alert("Error", "Failed to submit the form. Please try again.");
    } finally {
      setIsLoading(false); // Hide loader
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Loader /> // Show loader when isLoading is true
      ) : (
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
            onChangeText={(text) => {
              setFullName(text);
              setErrors((prev) => ({ ...prev, fullName: "" })); // Clear error on change
            }}
          />
          {errors.fullName ? <Text style={styles.errorText}>{errors.fullName}</Text> : null}

          {/* Age */}
          <Text style={styles.label}>How old are you?</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your age"
            placeholderTextColor="black"
            keyboardType="numeric"
            value={age}
            onChangeText={(text) => {
              setAge(text);
              setErrors((prev) => ({ ...prev, age: "" })); // Clear error on change
            }}
          />
          {errors.age ? <Text style={styles.errorText}>{errors.age}</Text> : null}

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
                onPress={() => {
                  setGender(option);
                  setErrors((prev) => ({ ...prev, gender: "" })); // Clear error on change
                }}
              >
                <Text style={styles.genderText}>
                  {option} {gender === option ? "✔" : ""}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.gender ? <Text style={styles.errorText}>{errors.gender}</Text> : null}

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
          {errors.dateOfBirth ? <Text style={styles.errorText}>{errors.dateOfBirth}</Text> : null}

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={() => setDatePickerVisible(false)} // Close the modal on cancel
          />

          {/* Email */}
          <Text style={styles.label}>Emergency Contact Email</Text>
          <TextInput
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrors((prev) => ({ ...prev, email: "" })); // Clear error on change
            }}
            placeholder="Enter your email"
            placeholderTextColor="black"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

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
                onChangeText={(text) => {
                  setPhoneNumber(text);
                  setErrors((prev) => ({ ...prev, phoneNumber: "" })); // Clear error on change
                }}
              />
            </View>
          </View>
          {errors.phoneNumber ? <Text style={styles.errorText}>{errors.phoneNumber}</Text> : null}

          {/* Address */}
          <Text style={styles.label}>Address</Text>
          <TextInput
            value={address}
            onChangeText={(text) => {
              setAddress(text);
              setErrors((prev) => ({ ...prev, address: "" })); // Clear error on change
            }}
            placeholder="Enter your address"
            placeholderTextColor="black"
            multiline
            numberOfLines={4}
            style={[styles.textArea, { backgroundColor: '#FFFFFF' }]}
          />
          {errors.address ? <Text style={styles.errorText}>{errors.address}</Text> : null}

          {/* Country */}
          <Text style={styles.label}>Where do you live?</Text>
          <TextInput
            value={country}
            onChangeText={(text) => {
              setCountry(text);
              setErrors((prev) => ({ ...prev, country: "" })); // Clear error on change
            }}
            placeholder="Enter your country"
            placeholderTextColor="black"
            style={styles.input}
          />
          {errors.country ? <Text style={styles.errorText}>{errors.country}</Text> : null}

          {/* State */}
          <Text style={styles.label}>State</Text>
          <TextInput
            value={state}
            onChangeText={(text) => {
              setState(text);
              setErrors((prev) => ({ ...prev, state: "" })); // Clear error on change
            }}
            placeholder="Enter your state"
            placeholderTextColor="black"
            style={styles.input}
          />
          {errors.state ? <Text style={styles.errorText}>{errors.state}</Text> : null}

          {/* District */}
          <Text style={styles.label}>District</Text>
          <TextInput
            value={district}
            onChangeText={(text) => {
              setDistrict(text);
              setErrors((prev) => ({ ...prev, district: "" })); // Clear error on change
            }}
            placeholder="Enter your district"
            placeholderTextColor="black"
            style={styles.input}
          />
          {errors.district ? <Text style={styles.errorText}>{errors.district}</Text> : null}

          {/* Document Upload */}
          <View>
            <Text style={styles.label}>Upload Aadhaar or License</Text>
            <TouchableOpacity onPress={pickDocument} style={styles.uploadButton}>
              <Text style={styles.uploadButtonText}>Choose File</Text>
            </TouchableOpacity>
            {errors.document ? <Text style={styles.errorText}>{errors.document}</Text> : null}

            {fileUri ? (
              <View style={styles.uploadedFileContainer}>
                <Text style={styles.uploadedFileName}>
                  {selectedFile?.assets?.[0]?.name}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedFile(null);
                    setFileUri("");
                  }}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>

          {/* Next Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleSubmit}
              disabled={isLoading} // Disable button when loading
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
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
    borderRadius: 10,
    color: "black",
    marginTop: 10,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
    marginTop: 10,
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
    marginTop: 10,
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
    marginTop: 10,
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
    width:"70%",
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

  // Error Text
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
  },

});