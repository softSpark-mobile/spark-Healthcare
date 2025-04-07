import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  Switch,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../components/Redux/store";
import {
  goToOnboardingThree,
  goBackToOnboardingOne,
} from "../components/Redux/authSlice";
import { Picker } from "@react-native-picker/picker";
import { Entypo } from "@expo/vector-icons"; // Using Entypo for the arrow-left icon
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BackendUrl } from "@/constants/backendUrl";
import axios from "axios";
import Loader from "@/components/Loader";

// Define the type for the props


export default function UpdateHealthData() {
  // Loader state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const userData = useSelector((state:any) => state.auth);
  const dispatch: AppDispatch = useDispatch();
  // const [bodyType, setBodyType] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState("");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [sugarLevel, setSugarLevel] = useState("");
  const [oxygenLevel, setOxygenLevel] = useState("");

  const [heartRate, setHeartRate] = useState("");
  const [bodyTemperature, setBodyTemperature] = useState("");

  const [isSurgery, setIsSurgery] = useState<boolean>(false);
  const [surgeryDetails, setSurgeryDetails] = useState<string>("");

  const calculateBMI = (h: string, w: string) => {
    const heightMeters = parseFloat(h) / 100;
    const weightKg = parseFloat(w);

    if (heightMeters > 0 && weightKg > 0) {
      setBmi((weightKg / (heightMeters * heightMeters)).toFixed(2));
    } else {
      setBmi("");
    }
  };

  const handleSubmit = async () => {
    console.log("Hitteddd");
  
    setIsLoading(true);
    try {
      const data = {
        Height: height,
        Weight: weight,
        BMI: bmi,
        BloodGroup: selectedBloodGroup,
        BloodPressure: bloodPressure,
        SugarLevel: sugarLevel,
        OxygenLevel: oxygenLevel,
        isSurgeries: isSurgery,
        SurgeriesDescription: surgeryDetails,
        HeartBeatRate: heartRate,
        BodyTemperature: bodyTemperature,
      };
      const response = await axios.post(
        `${BackendUrl}/api/user/UserHealthData`,
        data,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      console.log(response.data, "health response");

      if (response.status === 200) {
      
      }
    } catch (error) {
      console.log(error, "error");
    } finally {
      setIsLoading(false); // Hide loader
    }
  };
  return (
    <ScrollView style={styles.container}>
      {isLoading ? (
        <Loader /> // Show loader when isLoading is true
      ) : (
        <View>
          <Text style={styles.title}>Health Information</Text>
          
          {/* Height Input with cm label */}
          <View>
            <Text style={styles.label}>Height?</Text>
            <View style={styles.measurementInputContainer}>
              <TextInput
                style={styles.measurementInput}
                placeholder="Enter your height"
                keyboardType="numeric"
                maxLength={3}
                value={height}
                onChangeText={(text) => {
                  setHeight(text);
                  calculateBMI(text, weight);
                }}
              />
              <Text style={styles.measurementUnit}>cm</Text>
            </View>
          </View>

          {/* Weight Input with kg label */}
          <View>
            <Text style={styles.label}>Weight?</Text>
            <View style={styles.measurementInputContainer}>
              <TextInput
                style={styles.measurementInput}
                placeholder="Enter your weight"
                keyboardType="numeric"
                value={weight}
                maxLength={3}
                onChangeText={(text) => {
                  setWeight(text);
                  calculateBMI(height, text);
                }}
              />
              <Text style={styles.measurementUnit}>kg</Text>
            </View>
          </View>

          <Text style={styles.label}>BMI</Text>
          <TextInput
            style={styles.input}
            placeholder="Auto-calculated"
            value={bmi}
            editable={false}
          />

          <Text style={styles.label}>Blood Group?</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedBloodGroup}
              onValueChange={setSelectedBloodGroup}
            >
              <Picker.Item label="Select Blood Group" value="" />
              {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
                (group) => (
                  <Picker.Item key={group} label={group} value={group} />
                )
              )}
            </Picker>
          </View>

          <Text style={styles.label}>Blood Pressure (mmHg)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your blood pressure"
            keyboardType="numeric"
            maxLength={3}
            value={bloodPressure}
            onChangeText={setBloodPressure}
          />

          <Text style={styles.label}>Sugar level?(mg/dL)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your sugar level"
            keyboardType="numeric"
            maxLength={3}
            value={sugarLevel}
            onChangeText={setSugarLevel}
          />

          <Text style={styles.label}>Oxygen level (%)?</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your oxygen level"
            keyboardType="numeric"
            maxLength={3}
            value={oxygenLevel}
            onChangeText={setOxygenLevel}
          />

          <View>
            <Text style={styles.question}>Did you have surgeries?</Text>
            <View style={styles.toggleContainer}>
              <Text style={styles.surgeriesLabel}>No</Text>
              <Switch
                style={{marginTop:10,marginLeft:8}}
                trackColor={{ false: "#ccc", true: "#4CD964" }}
                thumbColor={isSurgery ? "#ffffff" : "#f4f3f4"}
                ios_backgroundColor="#ccc"
                onValueChange={() => setIsSurgery((prev) => !prev)}
                value={isSurgery}
              />
              <Text style={styles.surgeriesLabel}>Yes</Text>
            </View>

            {isSurgery && (
              <TextInput
                style={styles.input}
                placeholder="Please specify"
                value={surgeryDetails}
                onChangeText={(text: string) => setSurgeryDetails(text)}
              />
            )}
          </View>
          <Text style={styles.label}>Heart beat rate?</Text>
          <TextInput
            style={styles.input}
            maxLength={3}
            placeholder="Enter your heart rate"
            keyboardType="numeric"
            value={heartRate}
            onChangeText={setHeartRate}
          />

          <Text style={styles.label}>Body temperature?</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your body temperature"
            keyboardType="numeric"
            maxLength={3}
            value={bodyTemperature}
            onChangeText={setBodyTemperature}
          />

          {/* Button Section */}
          <View style={styles.buttonContainer}>
            {/* Previous Button with Icon */}
            <Pressable
              style={styles.prevButton}
              onPress={() => console.log("--")}>
              <Entypo name="arrow-left" size={24} color="black" />
            </Pressable>

            {/* Next Button with Text */}
            <Pressable style={styles.nextButton} onPress={() => handleSubmit()}>
              <Text style={styles.nextButtonText}>Next</Text>
            </Pressable>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#def1f8", padding: 20, flex: 1 },
  title: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  label: { 
    fontSize: 16, 
    fontWeight: "bold", 
    marginTop: 10, 
    color: "#333" 
  },
  surgeriesLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#FFFFFF",
    marginBottom: 10,
    color: "black",
    marginTop: 10,
  },
  // Styles for measurement inputs (height/weight)
  measurementInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    marginBottom: 10,
    marginTop: 10,
  },
  measurementInput: {
    flex: 1,
    padding: 10,
    color: "black",
  },
  measurementUnit: {
    paddingHorizontal: 15,
    color: "#888",
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#FFF",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 10,
  },
  question: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 0,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 0,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 50,
  },
  prevButton: {
    backgroundColor: "#FFFFFF",
    width: 80,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  nextButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 80,
    borderRadius: 12,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    width: "100%",
  },
});