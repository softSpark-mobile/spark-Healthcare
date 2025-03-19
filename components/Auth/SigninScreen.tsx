import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../Redux/store";
import { login } from "../Redux/authSlice";
import axios from "axios";
import { BackendUrl } from "../../constants/backendUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import Loader from "../Loader";

interface SignUpScreenProps {
  setSignFlag: (value: boolean) => void;
}

export default function SignUpScreen({ setSignFlag }: SignUpScreenProps) {
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Error states
  const [firstNameError, setFirstNameError] = useState<string>("");
  const [lastNameError, setLastNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");
  const [termsError, setTermsError] = useState<string>("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = async () => {
    // Reset all error messages
    setFirstNameError("");
    setLastNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setTermsError("");

    let isValid = true;

    if (!firstName) {
      setFirstNameError("First name is required.");
      isValid = false;
    }

    if (!lastName) {
      setLastNameError("Last name is required.");
      isValid = false;
    }

    if (!email) {
      setEmailError("Email is required.");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required.");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Confirm password is required.");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      isValid = false;
    }

    if (!isChecked) {
      setTermsError("Please accept the Terms and Conditions.");
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    setLoading(true);
    try {
      const data = {
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        Password: confirmPassword,
      };
      console.log("---------------");
      
      const response = await axios.post(`${BackendUrl}/api/user/CreateUser`, data);
      await AsyncStorage.setItem("token", response.data.data);
      dispatch(login(response.data.data));
    } catch (error) {
      console.log(error, "error");
      // setEmailError("An error occurred. Please try again.");
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Main Heading */}
          <Text style={styles.mainHeading}>Welcome!</Text>

          {/* Sign Up Title */}
          <Text style={styles.title}>Sign Up</Text>

          {/* First Name */}
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your first name"
            value={firstName}
            onChangeText={setFirstName}
          />
          {firstNameError ? <Text style={styles.errorText}>{firstNameError}</Text> : null}

          {/* Last Name */}
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your last name"
            value={lastName}
            onChangeText={setLastName}
          />
          {lastNameError ? <Text style={styles.errorText}>{lastNameError}</Text> : null}

          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputField}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Ionicons name="mail" size={20} color="black" style={styles.icon} />
          </View>
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputField}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye" : "eye-off"}
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

          {/* Confirm Password */}
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputField}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? "eye" : "eye-off"}
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>
          {confirmPasswordError ? (
            <Text style={styles.errorText}>{confirmPasswordError}</Text>
          ) : null}

          {/* Terms and Conditions Checkbox */}
          <View style={styles.checkboxContainer}>
            <TouchableOpacity onPress={() => setIsChecked(!isChecked)}>
              <Ionicons
                name={isChecked ? "checkbox" : "square-outline"}
                size={24}
                color="black"
              />
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>I accept the Terms & Conditions</Text>
          </View>
          {termsError ? <Text style={styles.errorText}>{termsError}</Text> : null}

          {/* Sign Up Button */}
          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </TouchableOpacity>

          {/* Login Navigation Link */}
          <Text style={styles.link} onPress={() => setSignFlag(false)}>
            Already have an account? <Text style={styles.linkBold}>Login</Text>
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#D8F5FF",
  },
  mainHeading: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#198EB6",
    textAlign: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: "black",
    marginBottom: 5,
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 5,
    backgroundColor: "white",
    justifyContent: "space-between",
  },
  inputField: {
    flex: 1,
    paddingVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "white",
    marginBottom: 5,
  },
  icon: {
    marginLeft: 10,
  },
  signUpButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    width: "70%",
    alignSelf: "center",
    marginTop: 10,
  },
  signUpButtonText: {
    color: "000",
    fontSize: 18,
    fontWeight: "bold",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 16,
  },
  link: {
    marginTop: 10,
    color: "black",
    textAlign: "center",
    fontSize: 18,
  },
  linkBold: {
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
});