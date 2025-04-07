import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../components/Redux/store";
import { goToOnboardingTwo, login } from "../components/Redux/authSlice";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetCountries, GetState, GetCity } from "react-country-state-city";
import Loader from "@/components/Loader";
import { FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { jwtDecode } from "jwt-decode";
import { BackendUrl } from "@/constants/backendUrl";

interface Country {
  id: number;
  name: string;
}

interface State {
  id: number;
  name: string;
}

interface City {
  id: number;
  name: string;
}

interface CustomJwtPayload {
  userId: string;
  userName: string;
  email: string;
  IsOnboardingFinish: boolean;
  exp: number;
  iat: number;
}



export default function UpdatePersonal(): JSX.Element {
  const dispatch: AppDispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.auth);
  console.log(userData, "userValues");

  const [fullName, setFullName] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState<boolean>(false);
  const [gender, setGender] = useState<string | null>(null);
  const [address, setAddress] = useState<string>("");

  // Country, State, City Selection
  const [countryid, setCountryid] = useState<number | null>(null);
  const [stateid, setStateid] = useState<number | null>(null);
  const [cityid, setCityid] = useState<number | null>(null);
  const [countryList, setCountryList] = useState<Country[]>([]);
  const [stateList, setStateList] = useState<State[]>([]);
  const [cityList, setCityList] = useState<City[]>([]);
  const [country, setCountry] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [city, setCity] = useState<string>("");

  const genderOptions = ["Male", "Female", "Others"];

  // Error messages
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    country: "",
    state: "",
  });

  // Loader state
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load user data from token
  const loadUserData = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      setFullName(decoded.userName);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  // Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const countries = await GetCountries();
        setCountryList(countries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

  // Handle country selection
  const handleCountryChange = async (countryId: number) => {
    setCountryid(countryId);
    const selectedCountry = countryList.find((c) => c.id === countryId);
    if (selectedCountry) {
      setCountry(selectedCountry.name);
    }
    try {
      const states = await GetState(countryId);
      setStateList(states);
      setStateid(null);
      setState("");
      setCityList([]);
      setCityid(null);
      setCity("");
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  // Handle state selection
  const handleStateChange = async (stateId: number) => {
    setStateid(stateId);
    const selectedState = stateList.find((s) => s.id === stateId);
    if (selectedState) {
      setState(selectedState.name);
    }
    if (!countryid) return;
    try {
      const cities = await GetCity(countryid, stateId);
      setCityList(cities);
      setCityid(null);
      setCity("");
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  // Handle city selection
  const handleCityChange = (cityId: number) => {
    setCityid(cityId);
    const selectedCity = cityList.find((c) => c.id === cityId);
    if (selectedCity) {
      setCity(selectedCity.name);
    }
  };

  // Date picker confirm
  const handleConfirm = (date: Date) => {
    const currentDate = new Date();
    if (date > currentDate) {
      setErrors((prev) => ({
        ...prev,
        dateOfBirth: "Date of Birth cannot be in the future.",
      }));
      return;
    }
    setDateOfBirth(date);
    setDatePickerVisible(false);
    setErrors((prev) => ({ ...prev, dateOfBirth: "" }));
  };

  // Form validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!fullName) newErrors.fullName = "Full Name is required.";
    if (!dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required.";
    if (!gender) newErrors.gender = "Gender is required.";
    if (!address) newErrors.address = "Address is required.";
    if (!countryid) newErrors.country = "Country is required.";
    if (!stateid) newErrors.state = "State is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async () => {
    console.log(country);
    console.log(state);
    
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const data = {
        Name: fullName,
        DOB: dateOfBirth?.toISOString() || "",
        Gender: gender || "",
        Address: address,
        Country: country || "",
        State: state || "",
      };

      const formData = new FormData();
      for (const [key, value] of Object.entries(data)) {
        formData.append(key, value);
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

      if (response.status === 200) {
        setOnboardingFlag(1); // Move to next onboarding step
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Alert.alert("Error", "Failed to submit the form. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Loader />
      ) : (
        <ScrollView>
          <Text style={styles.title}>Personal / General</Text>

          {/* Full Name */}
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="black"
            autoCapitalize="words"
            editable={false}
            value={fullName}
            onChangeText={(text) => {
              setFullName(text);
              setErrors((prev) => ({ ...prev, fullName: "" }));
            }}
          />
          {errors.fullName && (
            <Text style={styles.errorText}>{errors.fullName}</Text>
          )}

          {/* Gender Selection */}
          <Text style={styles.label}>Select Gender</Text>
          <View style={styles.genderContainer}>
            {genderOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.genderButton,
                  gender === option && styles.genderButtonSelected,
                ]}
                onPress={() => {
                  setGender(option);
                  setErrors((prev) => ({ ...prev, gender: "" }));
                }}
              >
                <Text
                  style={[
                    styles.genderText,
                    gender === option && styles.genderTextSelected,
                  ]}
                >
                  {option}
                </Text>
                <View style={styles.iconContainer}>
                  <FontAwesome
                    name="check-circle"
                    size={18}
                    color={gender === option ? "#3ECD7E" : "white"}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
          {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

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
          {errors.dateOfBirth && (
            <Text style={styles.errorText}>{errors.dateOfBirth}</Text>
          )}

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={() => setDatePickerVisible(false)}
          />

          {/* Address */}
          <Text style={styles.label}>Address</Text>
          <TextInput
            value={address}
            onChangeText={(text) => {
              setAddress(text);
              setErrors((prev) => ({ ...prev, address: "" }));
            }}
            placeholder="Enter your address"
            placeholderTextColor="black"
            multiline
            numberOfLines={4}
            style={[styles.textArea, { backgroundColor: "#FFFFFF" }]}
          />
          {errors.address && (
            <Text style={styles.errorText}>{errors.address}</Text>
          )}

          {/* Country, State, City Selection */}
          <View>
            <Text style={styles.label}>Country</Text>
            <Picker
              selectedValue={countryid}
              style={styles.pickerStyle}
              onValueChange={(itemValue) => handleCountryChange(itemValue)}
            >
              <Picker.Item label="Select Country" value={null} />
              {countryList.map((country) => (
                <Picker.Item
                  key={country.id}
                  label={country.name}
                  value={country.id}
                />
              ))}
            </Picker>
            {errors.country && (
              <Text style={styles.errorText}>{errors.country}</Text>
            )}

            <Text style={styles.label}>State</Text>
            <Picker
              selectedValue={stateid}
              style={styles.pickerStyle}
              onValueChange={(itemValue) => handleStateChange(itemValue)}
              enabled={!!countryid}
            >
              <Picker.Item label="Select State" value={null} />
              {stateList.map((state) => (
                <Picker.Item
                  key={state.id}
                  label={state.name}
                  value={state.id}
                />
              ))}
            </Picker>
            {errors.state && (
              <Text style={styles.errorText}>{errors.state}</Text>
            )}

            {/* <Text style={styles.label}>City</Text>
            <Picker
              selectedValue={cityid}
              style={styles.pickerStyle}
              onValueChange={(itemValue) => handleCityChange(itemValue)}
              enabled={!!stateid}
            >
              <Picker.Item label="Select City" value={null} />
              {cityList.map((city) => (
                <Picker.Item key={city.id} label={city.name} value={city.id} />
              ))}
            </Picker> */}
          </View>

          {/* Next Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleSubmit}
              disabled={isLoading}
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
    marginTop: 10,
  },
  genderButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    minWidth: 100,
    justifyContent: "space-between",
  },
  genderButtonSelected: {
    borderColor: "#3ECD7E",
  },
  genderText: {
    fontSize: 16,
    color: "black",
  },
  genderTextSelected: {
    color: "black",
    fontWeight: "bold",
  },
  iconContainer: {
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  nextButton: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "70%",
  },
  nextButtonText: { color: "#000", fontSize: 18, fontWeight: "bold" },
  pickerStyle: {
    height: 50,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    marginTop: 10,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
  },
});