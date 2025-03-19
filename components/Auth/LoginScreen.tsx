import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Loader from "../Loader";
import { useRouter } from "expo-router";

interface LoginScreenProps {
  setSignFlag: (flag: boolean) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ setSignFlag }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const router =useRouter();
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = () => {
    setEmailError(""); // Reset email error
    setPasswordError(""); // Reset password error

    if (!email) {
      setEmailError("Email is required.");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setPasswordError("Password is required.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (email === "test@example.com" && password === "123456") {
        alert("Login Success!");
        router.push('/(drawer)/(tabs)/(dashboardStack)')
      } else {
        setPasswordError("Incorrect email or password.");
      }
    }, 2000);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Text style={styles.mainHeading}>Welcome!</Text>
          <Text style={styles.title}>Login</Text>

          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Ionicons name="mail" size={20} color="black" style={styles.icon} />
          </View>
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!isPasswordVisible}
            />
            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
              <Ionicons name={isPasswordVisible ? "eye-off" : "eye"} size={24} color="black" />
            </TouchableOpacity>
          </View>
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <Text style={styles.link} onPress={() => setSignFlag(true)}>
            Don't have an account? <Text style={styles.linkBold}>Sign Up</Text>
          </Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#D8F5FF",
  },
  mainHeading: {
    fontSize: 34,
    fontWeight: "900",
    color: "#198EB6",
    textAlign: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "left",
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "700",
    color: "black",
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 5, // Reduced margin to make space for error message
    backgroundColor: "white",
    justifyContent: "space-between",
  },
  icon: {
    marginLeft: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "left",
  },
  forgotPassword: {
    marginBottom: 15,
    fontSize: 16,
    fontWeight: "700",
    color: "black",
    textAlign: "right",
  },
  loginButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    width: 155,
    height: 43,
    alignSelf: "center",
    marginTop: 10,
  },
  loginButtonText: {
    color: "black",
    fontSize: 20,
    fontWeight: "800",
  },
  link: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "700",
    color: "black",
    textAlign: "center",
  },
  linkBold: {
    fontWeight: "900",
  },
});

export default LoginScreen;