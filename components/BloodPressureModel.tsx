import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesome } from "@expo/vector-icons"; // Import FontAwesome for the heart icon
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

interface BloodPressureModelProps {
  visible: boolean;
  onClose: () => void;
  onSave: (systolic: number, diastolic: number, date: Date) => void;
}

const BloodPressureModel: React.FC<BloodPressureModelProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [systolic, setSystolic] = useState<number | undefined>(undefined);
  const [diastolic, setDiastolic] = useState<number | undefined>(undefined);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSave = () => {
    if (systolic === undefined || diastolic === undefined) {
      Alert.alert("Error", "Both Systolic and Diastolic values are required.");
      return;
    }
    onSave(systolic, diastolic, date);
  };

  // Close modal when touched outside
  const handleOutsidePress = () => {
    Keyboard.dismiss();
    onClose();
  };

  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <TouchableWithoutFeedback onPress={handleOutsidePress}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              {/* Date Selector Button */}
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowPicker(true)}
              >
                <Text style={styles.dateText}>{date.toDateString()}</Text>
              </TouchableOpacity>

              {showPicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display={Platform.OS === "ios" ? "inline" : "calendar"}
                  onChange={handleDateChange}
                />
              )}

              {/* Blood Pressure Title (Left Side) */}
              <Text style={styles.title}>Blood Pressure</Text>

              {/* Systolic Input */}
              <View style={styles.inputContainer}>
              <FontAwesome6 name="heart-circle-plus" size={20} color="black" />
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  maxLength={3}
                  value={systolic !== undefined ? systolic.toString() : ""}
                  onChangeText={(text) => {
                    const numericValue = parseInt(text.replace(/[^0-9]/g, ""), 10);
                    setSystolic(isNaN(numericValue) ? undefined : numericValue);
                  }}
                  placeholder="Enter your Systolic"
                />
              </View>

              {/* Diastolic Input */}
              <View style={styles.inputContainer}>
              <FontAwesome6 name="heart-circle-plus" size={24} color="black" />
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  maxLength={3}
                  value={diastolic !== undefined ? diastolic.toString() : ""}
                  onChangeText={(text) => {
                    const numericValue = parseInt(text.replace(/[^0-9]/g, ""), 10);
                    setDiastolic(isNaN(numericValue) ? undefined : numericValue);
                  }}
                  placeholder="Enter your Diastolic"
                />
              </View>

              {/* Save Button */}
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    width: "80%",
    alignItems: "center",
  },
  dateButton: {
    backgroundColor: "#8DB5FF",
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    width: "60%",
    alignItems: "center",
  },
  dateText: {
    color: "#000000",
    fontSize: 16,
    // fontWeight: "bold",
  },
  title: {
    fontSize: 18,
    // fontWeight: "bold",
    alignSelf: "flex-start",
    marginTop:20,
    marginBottom: 10,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    width: "100%",
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    textAlign: "center", // Center placeholder text
    color:'#000000',
  },
  saveButton: {
    backgroundColor: "#F0F0F0",
    padding: 12,
    borderRadius: 20,
    alignItems: "center",
    width: "40%",
    marginTop: 10,
  },
  buttonText: {
    color: "#000000",
    fontSize: 16,
    // fontWeight: "bold",
  },
});

export default BloodPressureModel;
