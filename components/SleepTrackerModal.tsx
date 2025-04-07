import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import WheelScrollView from "react-native-wheel-scrollview-picker";

interface SleepTrackerModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (hours: number) => void;
  currentSleep: number;
}

const SleepTrackerModal: React.FC<SleepTrackerModalProps> = ({
  visible,
  onClose,
  onSave,
  currentSleep,
}) => {
  const numbers = Array.from({ length: 23 }, (_, i) => (1 + i * 0.5).toFixed(1));
  const [sleepHours, setSleepHours] = useState<string>(currentSleep.toFixed(1));

  const initialIndex = numbers.indexOf(sleepHours);

  const handleValueChange = (value: string | undefined, index: number) => {
    if (value) {
      setSleepHours(value); // Only update if value is defined
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      {/* Modal Container */}
      <View style={styles.modalContainer}>
        {/* Modal Content */}
        <View style={styles.modalContent}>
          {/* Header - Centered */}
          <View style={styles.header}>
            <Text style={styles.title}>Set Sleep</Text>
            <MaterialCommunityIcons
              name="target"
              size={24}
              color="#000"
              style={styles.icon}
            />
          </View>

          {/* Goal Container */}
          <View style={styles.goalContainer}>
            <Text style={styles.label}>Hours of Sleep</Text>

            {/* Wheel ScrollView Picker */}
            <WheelScrollView
              style={styles.wheelPicker}
              dataSource={numbers}
              selectedIndex={initialIndex}
              renderItem={(data: string, index: number) => (
                <Text
                  style={[
                    styles.numberText,
                    sleepHours === data ? styles.selectedNumber : {},
                  ]}
                >
                  {data}
                </Text>
              )}
              onValueChange={handleValueChange} // Updated callback
              wrapperHeight={130} // Height of the picker
              itemHeight={50} // Height of each item
              highlightColor="#6ad7ff" // Highlight color for the selected item
            />

            {/* Horizontal Line with "Hrs" */}
            <View style={styles.horizontalLineContainer}>
              <View style={styles.horizontalLine} />
              <Text style={styles.unitText}>Hrs</Text>
            </View>
          </View>

          {/* Buttons Container */}
          <View style={styles.buttonsContainer}>
            {/* Cancel Button */}
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            {/* OK Button */}
            <TouchableOpacity
              style={[styles.button, styles.okButton]}
              onPress={() => onSave(parseFloat(sleepHours))}
            >
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    width: 300,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center", // Center content horizontally
  },
  header: {
    flexDirection: "row",
    alignItems: "center", // Center items vertically
    justifyContent: "center", // Center items horizontally
    width: "100%", // Ensure the header takes full width
    marginBottom:10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  icon: {
    marginLeft: 8, // Add spacing between text and icon
  },
  goalContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  label: {
    fontSize: 15,
    fontWeight: "bold",
    // marginTop: 29,
    marginRight:5,
  },
  wheelPicker: {
    height: 130,
    width: 100, // Set the width of the picker here
  },
  numberText: {
    fontSize: 24,
    color: "#aaa",
    textAlign: "center",
  },
  selectedNumber: {
    fontWeight: "bold", // Bold style for the selected item
    color: "#6ad7ff", // Highlight color for the selected item
  },
  horizontalLineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 15,
  },
  horizontalLine: {
    height: 2,
    width: 50,
    backgroundColor: "#3ECD7E",
    marginRight: 30,
    // marginTop: 29,
  },
  unitText: {
    fontSize: 16,
    fontWeight: "bold",
    // marginTop: 29,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    borderColor: "#000", // Red border for Cancel button
  },
  okButton: {
    borderColor: "#000", // Black border for OK button
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SleepTrackerModal;