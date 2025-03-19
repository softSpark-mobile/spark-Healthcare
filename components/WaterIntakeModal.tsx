import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import Feather from '@expo/vector-icons/Feather';
import WheelScrollView from "react-native-wheel-scrollview-picker";

interface WaterIntakeModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (litres: number) => void;
  currentIntake: number;
}

const WaterIntakeModal: React.FC<WaterIntakeModalProps> = ({
  visible,
  onClose,
  onSave,
  currentIntake,
}) => {
  const numbers = Array.from({ length: 91 }, (_, i) =>
    (1 + i * 0.1).toFixed(1)
  );
  const [litres, setLitres] = useState<string>(currentIntake.toFixed(1));

  const initialIndex = numbers.indexOf(litres);

  const handleValueChange = (value: string | undefined, index: number) => {
    if (value) {
      setLitres(value); // Only update if value is defined
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      {/* Detect clicks outside modal */}
      <View style={styles.modalContainer}>
        {/* Prevent modal content from closing when touched */}
        <View style={styles.modalContent}>
          {/* Header - Centered */}
          <View style={styles.header}>
            <Text style={styles.title}>Set Goal</Text>
            <Feather name="target" size={24} color="black" />
          </View>

          {/* Goal Container */}
          <View style={styles.goalContainer}>
            <View>
              <Text style={styles.label}>No. of Liters</Text>
            </View>

            {/* Wheel ScrollView Picker */}
            <View>
              <WheelScrollView
                style={styles.wheelPicker}
                dataSource={numbers}
                selectedIndex={initialIndex}
                renderItem={(data: string, index: number) => (
                  <Text
                    style={[
                      styles.numberText,
                      litres === data ? styles.selectedNumber : {},
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
            </View>

            {/* Horizontal Line with "L" */}
            <View style={styles.horizontalLineContainer}>
              <View style={styles.horizontalLine} />
              <Text style={styles.literText}>L</Text>
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
              onPress={() => onSave(parseFloat(litres))}
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
    padding: 10,
    borderRadius: 10,
    alignItems: "center", // Center content horizontally
  },
  header: {
    flexDirection: "row",
    alignItems: "center", // Center items vertically
    justifyContent: "center", // Center items horizontally
    width: "100%", // Ensure the header takes full width
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight:5,
  },
  
  goalContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: 140,
    padding:10,
    marginTop:10,
  },
  label: {
    fontSize: 15,
    fontWeight: "bold",
    // marginTop: 29,
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
    backgroundColor: "#6ad7ff",
    marginRight: 30,
    // marginTop: 29,
  },
  literText: {
    fontSize: 16,
    fontWeight: "bold",
    // marginTop: 29,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
    marginBottom:10,
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

export default WaterIntakeModal;
