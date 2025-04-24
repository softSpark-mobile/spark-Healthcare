import React, { useEffect, useState } from "react";
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
import { Picker } from "@react-native-picker/picker";
import { Entypo } from "@expo/vector-icons";
import { BackendUrl } from "@/constants/backendUrl";
import axios from "axios";
import Loader from "@/components/Loader";

interface OnboardingTwoProps {
  setOnboardingFlag: (flag: number) => void;
}

interface HealthData {
  Height: string;
  Weight: string;
  BMI: string;
  BloodGroup: string;
  BloodPressure: string;
  SugarLevel: string;
  OxygenLevel: string;
  HeartBeatRate: string;
  BodyTemperature: string;
  isSurgeries: boolean;
  SurgeriesDescription: string;
}

export default function OnboardingTwo({ setOnboardingFlag }: OnboardingTwoProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingData, setIsFetchingData] = useState<boolean>(true);
  const userData = useSelector((state: any) => state.auth);
  
  // Form state with explicit types
  const [formData, setFormData] = useState<HealthData>({
    Height: "",
    Weight: "",
    BMI: "",
    BloodGroup: "",
    BloodPressure: "",
    SugarLevel: "",
    OxygenLevel: "",
    HeartBeatRate: "",
    BodyTemperature: "",
    isSurgeries: false,
    SurgeriesDescription: "",
  });

  // Fetch health data on component mount
  useEffect(() => {
    

    fetchHealthData();
  }, [userData.userId, userData.token]);
  const fetchHealthData = async () => {
    try {
      setIsFetchingData(true);
      const response = await axios.get(
        `${BackendUrl}/api/user/getHealthId/${userData.userId}`,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
    
      
      // console.log("Fetched health data:", response.data.data); // Debug log
      setFormData(response?.data.data)
      console.log('formdata is ',formData);
      
      
    } catch (error) {
      console.error("Error fetching health data:", error);
    } finally {
      setIsFetchingData(false);
    }
  };
  const handleDecimalInput = (text: string, field: keyof HealthData) => {
    if (text === "") {
      setFormData(prev => ({ ...prev, [field]: "" }));
      return;
    }

    if (/^\d*\.?\d{0,2}$/.test(text)) {
      const parts = text.split(".");
      if (parts[0].length <= 3) {
        if (parts.length === 2 && parts[1].length > 2) {
          return;
        }
        setFormData(prev => ({ ...prev, [field]: text }));
      }
    }
  };

  const calculateBMI = () => {
    const heightMeters = parseFloat(formData.Height) / 100;
    const weightKg = parseFloat(formData.Weight);

    if (heightMeters > 0 && weightKg > 0) {
      const calculatedBMI = (weightKg / (heightMeters * heightMeters)).toFixed(2);
      setFormData(prev => ({ ...prev, BMI: calculatedBMI }));
    } else {
      setFormData(prev => ({ ...prev, BMI: "" }));
    }
  };

  // Update BMI whenever height or weight changes
  useEffect(() => {
    calculateBMI();
  }, [formData.Height, formData.Weight]);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${BackendUrl}/api/user/UserHealthData`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      if (response.status === 200) {
        setOnboardingFlag(2);
      }
    } catch (error) {
      console.error("Error submitting health data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || isFetchingData) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View>
          <Text style={styles.title}>Health Information</Text>

          {/* Height Input */}
          <View>
            <Text style={styles.label}>Height?</Text>
            <View style={styles.measurementInputContainer}>
              <TextInput
                style={styles.measurementInput}
                placeholder="Enter your height"
                keyboardType="numeric"
                value={formData.Height}
                onChangeText={(text) => {
                  handleDecimalInput(text, "Height");
                }}
              />
              <Text style={styles.measurementUnit}>cm</Text>
            </View>
          </View>

          {/* Weight Input */}
          <View>
            <Text style={styles.label}>Weight?</Text>
            <View style={styles.measurementInputContainer}>
              <TextInput
                style={styles.measurementInput}
                placeholder="Enter your weight"
                keyboardType="numeric"
                value={formData.Weight}
                onChangeText={(text) => {
                  handleDecimalInput(text, "Weight");
                }}
              />
              <Text style={styles.measurementUnit}>kg</Text>
            </View>
          </View>

          <Text style={styles.label}>BMI (Body mass index)</Text>
          <TextInput
            style={styles.input}
            placeholder="Auto-calculated"
            value={formData.BMI}
            editable={false}
          />

          <Text style={styles.label}>Blood Group?</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.BloodGroup}
              onValueChange={(value) => 
                setFormData(prev => ({ ...prev, BloodGroup: value }))
              }
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
            value={formData.BloodPressure}
            onChangeText={(text) =>
              handleDecimalInput(text, "BloodPressure")
            }
          />

          <Text style={styles.label}>Sugar level?(mg/dL)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your sugar level"
            keyboardType="numeric"
            value={formData.SugarLevel}
            onChangeText={(text) => handleDecimalInput(text, "SugarLevel")}
          />

          <Text style={styles.label}>Oxygen level (%)?</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your oxygen level"
            keyboardType="numeric"
            value={formData.OxygenLevel}
            onChangeText={(text) => handleDecimalInput(text, "OxygenLevel")}
          />

          <View>
            <Text style={styles.question}>Did you have surgeries?</Text>
            <View style={styles.toggleContainer}>
              <Text style={styles.surgeriesLabel}>No</Text>
              <Switch
                style={styles.switch}
                trackColor={{ false: "#ccc", true: "#4CD964" }}
                thumbColor={formData.isSurgeries ? "#ffffff" : "#f4f3f4"}
                ios_backgroundColor="#ccc"
                onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, isSurgeries: value }))
                }
                value={formData.isSurgeries}
              />
              <Text style={styles.surgeriesLabel}>Yes</Text>
            </View>

            {formData.isSurgeries && (
              <TextInput
                style={styles.input}
                placeholder="Please specify"
                value={formData.SurgeriesDescription}
                onChangeText={(text) => 
                  setFormData(prev => ({ ...prev, SurgeriesDescription: text }))
                }
              />
            )}
          </View>

          <Text style={styles.label}>Heart beat rate?</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your heart rate"
            keyboardType="numeric"
            value={formData.HeartBeatRate}
            onChangeText={(text) => handleDecimalInput(text, "HeartBeatRate")}
          />

          <Text style={styles.label}>Body temperature?</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your body temperature"
            keyboardType="numeric"
            value={formData.BodyTemperature}
            onChangeText={(text) =>
              handleDecimalInput(text, "BodyTemperature")
            }
          />

          {/* Button Section */}
          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.prevButton}
              onPress={() => setOnboardingFlag(0)}
            >
              <Entypo name="arrow-left" size={24} color="black" />
            </Pressable>

            <Pressable style={styles.nextButton} onPress={handleSubmit}>
              <Text style={styles.nextButtonText}>Next</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// Styles remain the same as in previous implementation
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#def1f8",
    padding: 20,
    flex: 1,
  },
  title: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    color: "#333",
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
    padding: 15,
    backgroundColor: "#FFFFFF",
    marginBottom: 10,
    color: "black",
    marginTop: 10,
    fontSize: 16,
  },
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
    padding: 15,
    color: "black",
    fontSize: 16,
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
    marginBottom: 10,
  },
  question: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 0,
    color: "#333",
    marginTop: 10,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 0,
  },
  switch: {
    marginTop: 10,
    marginLeft: 8,
    marginRight: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
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
  },
});