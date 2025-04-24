import React, { useState, useEffect, useRef } from "react";
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
import { login } from "../components/Redux/authSlice";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetCountries, GetState, GetCity } from "react-country-state-city";
import Loader from "@/components/Loader";
import { FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { jwtDecode } from "jwt-decode";
import { BackendUrl } from "@/constants/backendUrl";
import PhoneInput from "react-native-phone-number-input";

interface CountryData {
  id: number;
  name: string;
  isoCode?: string;
}

interface State {
  id: number;
  name: string;
}

interface City {
  id: number;
  name: string;
}

export interface CustomJwtPayload {
  userId: string;
  userName: string;
  email: string;
  IsOnboardingFinish: boolean;
  exp: number;
  iat: number;
}

interface OnboardingOneProps {
  setOnboardingFlag: (flag: number) => void;
}

export default function OnboardingOne({
  setOnboardingFlag,
}: OnboardingOneProps): JSX.Element {
  const dispatch: AppDispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.auth);

  const [fullName, setFullName] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState<boolean>(false);
  const [address, setAddress] = useState<string>("");
  const [gender, setGender] = useState<string>("");

  // Phone Input
  const phoneInput = useRef<PhoneInput>(null);
  const [formattedEmergencyPhoneNumber, setFormattedEmergencyPhoneNumber] = useState("");
  const [emergencyPhoneNumber, setEmergencyPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState<string>("IN");
  const [callingCode, setCallingCode] = useState("91");

  // Location Selection
  const [countryid, setCountryid] = useState<number | null>(null);
  const [stateid, setStateid] = useState<number | null>(null);
  const [cityid, setCityid] = useState<number | null>(null);
  const [countryList, setCountryList] = useState<CountryData[]>([]);
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
    emergencyPhone: "",
  });

  // Loader states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingCountries, setIsLoadingCountries] = useState<boolean>(true);
  const [isLoadingUserData, setIsLoadingUserData] = useState<boolean>(true);

  // Load countries and user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingCountries(true);
        const countries = await GetCountries();
        
        if (countries && countries.length > 0) {
          const formattedCountries = countries.map((data: any) => ({
            id: data?.id,
            name: data?.name,
            isoCode: data?.isoCode,
          }));
          setCountryList(formattedCountries);
          await loadUserData(formattedCountries);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoadingCountries(false);
      }
    };
    
    fetchData();
  }, []);

  const loadUserData = async (countries: CountryData[]) => {
    try {
      setIsLoadingUserData(true);
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode<CustomJwtPayload>(token);
        setFullName(decoded.userName);

        const response = await axios.get(`${BackendUrl}/api/user/getUserByUserId/${userData.userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response?.data.data,'ggggggggggg');
        
        if (response?.data.data) {
          const userData = response.data.data;
          setFullName(userData.Name || decoded.userName);
          setGender(userData.Gender || "");
          setAddress(userData.Address || "");
          
          if (userData.DOB) {
            setDateOfBirth(new Date(userData.DOB));
          }
          
          // Handle phone number and country code
          if (userData.PhoneNo) {
            setEmergencyPhoneNumber(userData.PhoneNo);
          }
          
          if (userData.CountryCode) {
            // Remove '+' if present and set calling code
            const code = userData.CountryCode.replace('+', '');
            setCallingCode(code);
            
            // Find country by calling code
            const foundCountry = countries.find(c => 
              phoneInput.current?.getCallingCode() === code
            );
            if (foundCountry?.isoCode) {
              setCountryCode(foundCountry.isoCode);
            }
          }
          console.log(emergencyPhoneNumber,countryCode,"iiiiiiiiii");
          
          // Set country and state from API response
          if (userData.Country) {
            setCountry(userData.Country);
            const foundCountry = countries.find(c => c.name === userData.Country);
            if (foundCountry) {
              setCountryid(foundCountry.id);
              const states = await GetState(foundCountry.id);
              setStateList(states || []);
              
              if (userData.State) {
                setState(userData.State);
                const foundState = states.find(s => s.name === userData.State);
                if (foundState) {
                  setStateid(foundState.id);
                  const cities = await GetCity(foundCountry.id, foundState.id);
                  setCityList(cities || []);
                  
                  if (userData.City) {
                    setCity(userData.City);
                    const foundCity = cities.find(c => c.name === userData.City);
                    if (foundCity) {
                      setCityid(foundCity.id);
                    }
                  }
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setIsLoadingUserData(false);
    }
  };

  // Handle country selection
  const handleCountryChange = async (countryId: number) => {
    if (!countryId) return;

    setCountryid(countryId);
    const selectedCountry = countryList.find((c) => c.id === countryId);
    if (selectedCountry) {
      setCountry(selectedCountry.name);
    }

    try {
      setIsLoading(true);
      const states = await GetState(countryId);
      setStateList(states || []);
      setStateid(null);
      setState("");
      setCityList([]);
      setCityid(null);
      setCity("");
      setErrors((prev) => ({ ...prev, country: "" }));
    } catch (error) {
      console.error("Error fetching states:", error);
      Alert.alert("Error", "Failed to load states. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle state selection
  const handleStateChange = async (stateId: number) => {
    if (!stateId || !countryid) return;

    setStateid(stateId);
    const selectedState = stateList.find((s) => s.id === stateId);
    if (selectedState) {
      setState(selectedState.name);
    }

    try {
      setIsLoading(true);
      const cities = await GetCity(countryid, stateId);
      setCityList(cities || []);
      setCityid(null);
      setCity("");
      setErrors((prev) => ({ ...prev, state: "" }));
    } catch (error) {
      console.error("Error fetching cities:", error);
      Alert.alert("Error", "Failed to load cities. Please try again.");
    } finally {
      setIsLoading(false);
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

    if (!fullName.trim()) newErrors.fullName = "Full Name is required.";
    if (!dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required.";
    if (!gender) newErrors.gender = "Gender is required.";
    if (!address.trim()) newErrors.address = "Address is required.";
    if (!countryid) newErrors.country = "Country is required.";
    if (!stateid) newErrors.state = "State is required.";

    if (!emergencyPhoneNumber.trim()) {
      newErrors.emergencyPhone = "Emergency phone number is required.";
    } else if (
      phoneInput.current &&
      !phoneInput.current?.isValidNumber(emergencyPhoneNumber)
    ) {
      newErrors.emergencyPhone = "Please enter a valid phone number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    
    try {
      const currentCallingCode = phoneInput.current?.getCallingCode() || callingCode;
      const localPhone = emergencyPhoneNumber.trim();      
      const data = {
        Name: fullName,
        DOB: dateOfBirth?.toISOString() || "",
        Gender: gender || "",
        Address: address,
        Country: country || "",
        State: state || "",
        City: city || "",
        CountryCode: `+${currentCallingCode}`,
        PhoneNo: localPhone || "",
      };

      const response = await axios.put(
        `${BackendUrl}/api/user/UpadateUserValues`,
        data,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
            "Content-Type": "application/json",
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

  if (isLoadingUserData) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Loader />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Personal / General</Text>

          {/* Full Name */}
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#666"
            autoCapitalize="words"
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
          {errors.gender && (
            <Text style={styles.errorText}>{errors.gender}</Text>
          )}

          {/* Date of Birth */}
          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setDatePickerVisible(true)}
          >
            <Text
              style={{ color: dateOfBirth ? "black" : "#666", fontSize: 16 }}
            >
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
            maximumDate={new Date()}
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
            placeholderTextColor="#666"
            multiline
            numberOfLines={4}
            style={[styles.textArea, { backgroundColor: "#FFFFFF" }]}
          />
          {errors.address && (
            <Text style={styles.errorText}>{errors.address}</Text>
          )}

          {/* Emergency Phone Number */}
          <Text style={styles.label}>Emergency Number (Parents/Guardians)</Text>
          <View style={styles.phoneInputContainer}>
            <PhoneInput
              ref={phoneInput}
              defaultValue={emergencyPhoneNumber}
              defaultCode={countryCode as any}
              
              layout="first"
              onChangeText={setEmergencyPhoneNumber}
              onChangeFormattedText={setFormattedEmergencyPhoneNumber}
              onChangeCountry={(country) => {
                setCountryCode(country.cca2);
                setCallingCode(country.callingCode[0]);
              }}
              textInputProps={{
                keyboardType: "phone-pad",
                placeholder: "Enter phone number",
              }}
              containerStyle={styles.phoneContainer}
              textContainerStyle={styles.phoneTextContainer}
              countryPickerButtonStyle={styles.countryPickerButton}
              textInputStyle={styles.phoneTextInput}
              codeTextStyle={styles.codeText}
              withDarkTheme={false}
              withShadow={false}
              autoFocus={false}
            />
          </View>
          {errors.emergencyPhone && (
            <Text style={styles.errorText}>{errors.emergencyPhone}</Text>
          )}

          {/* Country Selection */}
          <Text style={styles.label}>Country</Text>
          {isLoadingCountries ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={countryid}
                style={styles.pickerStyle}
                onValueChange={(itemValue) => {
                  if (itemValue !== null) {
                    handleCountryChange(itemValue);
                  }
                }}
                dropdownIconColor="#000"
              >
                <Picker.Item label={country || "Select Country"} value={countryid || null} color={countryid ? "#000" : "#666"} />
                {countryList.map((country) => (
                  <Picker.Item
                    key={country.id}
                    label={country.name}
                    value={country.id}
                    color="#000"
                  />
                ))}
              </Picker>
            </View>
          )}
          {errors.country && (
            <Text style={styles.errorText}>{errors.country}</Text>
          )}

          {/* State Selection */}
          <Text style={styles.label}>State</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={stateid}
              style={styles.pickerStyle}
              onValueChange={(itemValue) => {
                if (itemValue !== null) {
                  handleStateChange(itemValue);
                }
              }}
              enabled={!!countryid && !isLoading}
              dropdownIconColor="#000"
            >
              <Picker.Item label={state || "Select State"} value={stateid || null} color={stateid ? "#000" : "#666"} />
              {stateList.map((state) => (
                <Picker.Item
                  key={state.id}
                  label={state.name}
                  value={state.id}
                  color="#000"
                />
              ))}
            </Picker>
          </View>
          {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}

          {/* City Selection */}
          {/* {cityList.length > 0 && (
            <>
              <Text style={styles.label}>City</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={cityid}
                  style={styles.pickerStyle}
                  onValueChange={(itemValue) => {
                    if (itemValue !== null) {
                      handleCityChange(itemValue);
                    }
                  }}
                  enabled={!!stateid && !isLoading}
                  dropdownIconColor="#000"
                >
                  <Picker.Item label={city || "Select City"} value={cityid || null} color={cityid ? "#000" : "#666"} />
                  {cityList.map((city) => (
                    <Picker.Item
                      key={city.id}
                      label={city.name}
                      value={city.id}
                      color="#000"
                    />
                  ))}
                </Picker>
              </View>
            </>
          )} */}

          {/* Next Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.nextButtonText}>Next</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#def1f8",
    padding: 20,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "black",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
    color: "black",
  },
  input: {
    borderWidth: 1,
    borderColor: "#FFFFFF",
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    color: "black",
    marginTop: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    padding: 15,
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
    backgroundColor: "transparent",
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
    borderWidth: 1,
    borderColor: "#FFF",
  },
  nextButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  pickerStyle: {
    height: 50,
    color: "black",
    width: "100%",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
    marginLeft: 5,
  },
  phoneInputContainer: {
    marginTop: 10,
    width: "100%",
  },
  phoneContainer: {
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    elevation: 0,
    shadowColor: "transparent",
  },
  phoneTextContainer: {
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  countryPickerButton: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: "#fff",
  },
  phoneTextInput: {
    color: 'black',
    height: 50,
  },
  codeText: {
    color: 'black',
  },
});