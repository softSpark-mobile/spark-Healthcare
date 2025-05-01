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
  Image,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../components/Redux/store";
import axios from "axios";
import { GetCountries, GetState } from "react-country-state-city";
import Loader from "@/components/Loader";
import { FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { BackendUrl } from "@/constants/backendUrl";
import PhoneInput from "react-native-phone-number-input";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { getCountryCallingCode, getCountries } from "libphonenumber-js";

interface Country {
  id: number;
  name: string;
  isoCode?: string;
}
interface personal {
  PhoneNo?: string;
  CountryCode?: string;
  Country?: string;
  State?: string;
  Address?: string;
  Gender?: string;
  DOB?: string;
  LastName?: string;
  FirstName?: string;
  ProfilePhoto?: string;
  CoverPhoto?: string;
}
interface State {
  id: number;
  name: string;
}

export default function OnboardingOne(): JSX.Element {
  const dispatch: AppDispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.auth);

  const [formValues, setFormValues] = useState<personal | null>(null);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState<boolean>(false);
  const [gender, setGender] = useState<string | null>(null);
  const [address, setAddress] = useState<string>("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [profilePhotoUri, setProfilePhotoUri] = useState<string | null>(null);
  const [coverPhotoUri, setCoverPhotoUri] = useState<string | null>(null);
  const [countryid, setCountryid] = useState<number | null>(null);
  const [stateid, setStateid] = useState<number | null>(null);
  const [countryList, setCountryList] = useState<Country[]>([]);
  const [stateList, setStateList] = useState<State[]>([]);
  const [country, setCountry] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const phoneInputRef = useRef<PhoneInput>(null);
  const [defaultCountryCode, setDefaultCountryCode] = useState<string>("US");

  const genderOptions = ["Male", "Female", "Others"];

  const [errors, setErrors] = useState<{ [key: string]: string }>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    country: "",
    state: "",
    phoneNumber: "",
    profilePhoto: "",
    coverPhoto: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingCountries, setIsLoadingCountries] = useState<boolean>(true);
  const [isInitialDataLoaded, setIsInitialDataLoaded] =
    useState<boolean>(false);

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
        setGender(userData.Gender || null);
        setAddress(userData.Address || "");
        setCountry(userData.Country || "");
        setState(userData.State || "");
        setPhoneNumber(userData.PhoneNo ||"")
        // Handle phone number
        if (userData.PhoneNo) {
          console.log(userData.PhoneNo, "=============");
          const num = userData.PhoneNo;
          console.log(num,"nummmmmmmmmmmmmm");
          
          setPhoneNumber(userData.PhoneNo);
          console.log(phoneNumber, "------p=========");
        }

        setProfilePhoto(userData.profilePhoto || null);
        setCoverPhoto(userData.coverPhoto || null);
        if (userData.DOB) {
          setDateOfBirth(new Date(userData.DOB));
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
      setIsInitialDataLoaded(true)
    }
  };

  const fetchCountries = async () => {
    try {
      setIsLoadingCountries(true);
      const countries = await GetCountries();

      if (countries?.length > 0) {
        const formattedCountries = countries.map((data: any) => ({
          id: data?.id,
          name: data?.name,
          isoCode: data?.isoCode,
        }));
        setCountryList(formattedCountries);
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    } finally {
      setIsLoadingCountries(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (formValues?.Country && countryList.length > 0) {
      const foundCountry = countryList.find(
        (c) => c.name === formValues.Country
      );
      if (foundCountry) {
        setCountryid(foundCountry.id);
        console.log(foundCountry.id,"country id");
        
        setCountry(foundCountry.name);
        handleCountryChange(foundCountry.id);
      }
    }
  }, [formValues, countryList]);

  useEffect(() => {
    if (formValues?.State && stateList.length > 0 && countryid) {
      const foundState = stateList.find((s) => s.name === formValues.State);
      if (foundState) {
        setStateid(foundState.id);
        setState(foundState.name);
      }
    }
  }, [formValues, stateList, countryid]);

  const handleCountryChange = async (countryId: number) => {
    if (!countryId) return;

    setCountryid(countryId);
    const selectedCountry = countryList?.find((c) => c.id === countryId);
    if (selectedCountry) {
      setCountry(selectedCountry?.name);
    }
    try {
      setIsLoading(true);
      const states = await GetState(countryId);
      setStateList(states || []);
      setStateid(null);
      setState("");
      setErrors((prev) => ({ ...prev, country: "" }));
    } catch (error) {
      console.error("Error fetching states:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStateChange = async (stateId: number) => {
    if (!stateId || !countryid) return;

    setStateid(stateId);
    const selectedState = stateList.find((s) => s.id === stateId);
    if (selectedState) {
      setState(selectedState.name);
    }

    setErrors((prev) => ({ ...prev, state: "" }));
  };

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

  const pickImage = async (type: "profile" | "cover") => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: type === "profile" ? [1, 1] : [16, 9],
        quality: 0.8,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        if (type === "profile") {
          setProfilePhotoUri(uri);
          setErrors((prev) => ({ ...prev, profilePhoto: "" }));
        } else {
          setCoverPhotoUri(uri);
          setErrors((prev) => ({ ...prev, coverPhoto: "" }));
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    // Validate form
    let isValid = true;
    const newErrors = { ...errors };

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }

    if (!dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
      isValid = false;
    }

    if (!gender) {
      newErrors.gender = "Gender is required";
      isValid = false;
    }

    if (!address.trim()) {
      newErrors.address = "Address is required";
      isValid = false;
    }

    if (!countryid) {
      newErrors.country = "Country is required";
      isValid = false;
    }

    if (!stateid) {
      newErrors.state = "State is required";
      isValid = false;
    }

    const currentPhone =
      phoneInputRef.current?.getNumberAfterPossiblyEliminatingZero()?.number;
    if (!currentPhone) {
      newErrors.phoneNumber = "Phone number is required";
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("FirstName", firstName);
      formData.append("LastName", lastName);
      if (dateOfBirth) formData.append("DOB", dateOfBirth.toISOString());
      if (gender) formData.append("Gender", gender);
      if (address) formData.append("Address", address);
      if (country) formData.append("Country", country);
      if (state) formData.append("State", state);

      // Get the formatted phone number
      const phoneNumber =
        phoneInputRef.current?.getNumberAfterPossiblyEliminatingZero()?.number;
      if (phoneNumber) {
        formData.append("PhoneNo", phoneNumber);
      }

      if (profilePhotoUri) {
        const profilePhoto = {
          uri: profilePhotoUri,
          type: "image/jpeg",
          name: "profile.jpg",
        };
        formData.append("profilePhoto", profilePhoto as any);
      }

      if (coverPhotoUri) {
        const coverPhoto = {
          uri: coverPhotoUri,
          type: "image/jpeg",
          name: "cover.jpg",
        };
        formData.append("coverPhoto", coverPhoto as any);
      }

      const response = await axios.put(
        `${BackendUrl}/api/user/updateUserData`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        Alert.alert("Success", "Profile updated successfully!");
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Failed to update profile"
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Alert.alert("Error", "Failed to submit the form. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isInitialDataLoaded || isLoadingCountries) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Personal / General</Text>

        <View style={styles.photoContainer}>
          <TouchableOpacity
            style={styles.coverPhotoContainer}
            onPress={() => pickImage("cover")}
          >
            {coverPhotoUri ? (
              <Image
                source={{ uri: coverPhotoUri }}
                style={styles.coverPhoto}
              />
            ) : coverPhoto ? (
              <Image
                source={{ uri: `${BackendUrl}/${coverPhoto}` }}
                style={styles.coverPhoto}
              />
            ) : (
              <View style={styles.coverPhotoPlaceholder}>
                <MaterialIcons name="add-a-photo" size={24} color="white" />
                <Text style={styles.photoPlaceholderText}>Add Cover Photo</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.profilePhotoContainer}
            onPress={() => pickImage("profile")}
          >
            {profilePhotoUri ? (
              <Image
                source={{ uri: profilePhotoUri }}
                style={styles.profilePhoto}
              />
            ) : profilePhoto ? (
              <Image
                source={{ uri: `${BackendUrl}/${profilePhoto}` }}
                style={styles.profilePhoto}
              />
            ) : (
              <View style={styles.profilePhotoPlaceholder}>
                <MaterialIcons name="add-a-photo" size={24} color="white" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your first name"
          placeholderTextColor="#666"
          autoCapitalize="words"
          value={firstName}
          onChangeText={(text) => {
            setFirstName(text);
            setErrors((prev) => ({ ...prev, firstName: "" }));
          }}
        />
        {errors.firstName && (
          <Text style={styles.errorText}>{errors.firstName}</Text>
        )}

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your last name"
          placeholderTextColor="#666"
          autoCapitalize="words"
          value={lastName}
          onChangeText={(text) => {
            setLastName(text);
            setErrors((prev) => ({ ...prev, lastName: "" }));
          }}
        />
        {errors.lastName && (
          <Text style={styles.errorText}>{errors.lastName}</Text>
        )}

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

        <Text style={styles.label}>Date of Birth</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setDatePickerVisible(true)}
        >
          <Text style={{ color: dateOfBirth ? "black" : "#666", fontSize: 16 }}>
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

        <Text style={styles.label}>Emergency Number (Parents/Guardians)</Text>
        <View style={styles.phoneInputContainer}>
          <PhoneInput
            ref={phoneInputRef}
            defaultValue={phoneNumber ||"1234"}
            defaultCode={defaultCountryCode as any}
            layout="first"
            onChangeFormattedText={(text) => {
              setPhoneNumber(text);
              setErrors((prev) => ({ ...prev, phoneNumber: "" }));
            }}
            containerStyle={styles.phoneContainer}
            textContainerStyle={styles.phoneTextContainer}
            countryPickerButtonStyle={styles.countryPickerButton}
            textInputStyle={styles.phoneTextInput}
            codeTextStyle={styles.codeText}
            textInputProps={{
              placeholder: "Enter phone number",
              placeholderTextColor: "#666",
            }}
          />
        </View>
        {errors.phoneNumber && (
          <Text style={styles.errorText}>{errors.phoneNumber}</Text>
        )}

        <Text style={styles.label}>Country</Text>
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
            <Picker.Item label="Select Country" value={null} color="#666" />
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
        {errors.country && (
          <Text style={styles.errorText}>{errors.country}</Text>
        )}

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
            <Picker.Item label="Select State" value={null} color="#666" />
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

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.nextButtonText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  photoContainer: {
    marginBottom: 20,
    position: "relative",
    height: 200,
  },
  coverPhotoContainer: {
    height: 150,
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#ccc",
  },
  coverPhoto: {
    width: "100%",
    height: "100%",
  },
  coverPhotoPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#999",
  },
  profilePhotoContainer: {
    position: "absolute",
    bottom: 0,
    left: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
    overflow: "hidden",
    backgroundColor: "#ccc",
  },
  profilePhoto: {
    width: "100%",
    height: "100%",
  },
  profilePhotoPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#999",
  },
  photoPlaceholderText: {
    color: "white",
    marginTop: 5,
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
    height: 60,
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    elevation: 0,
    shadowColor: "transparent",
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  phoneTextContainer: {
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingVertical: 0,
  },
  countryPickerButton: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: "#fff",
    width: 100,
  },
  phoneTextInput: {
    color: "black",
    height: 50,
    backgroundColor: "#fff",
  },
  codeText: {
    color: "black",
  },
});
