import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

interface CustomDateModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (fromDate: Date, toDate: Date) => void;
}

const CustomDateModal: React.FC<CustomDateModalProps> = ({ visible, onClose, onSubmit }) => {
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const formatDate = (date: Date): string => date.toLocaleDateString("en-GB").replace(/\//g, "-");

  const handleSubmit = () => {
    if (fromDate > toDate) {
      Alert.alert("Invalid Date Range", "The 'To Date' cannot be earlier than 'From Date'.");
      return;
    }
    onSubmit(fromDate, toDate);
    onClose(); // Close modal after submitting
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Select Date Range</Text>

          {/* From Date Picker */}
          <TouchableOpacity style={styles.dateInput} onPress={() => setShowFromPicker(true)}>
            <Text style={styles.dateText}>{formatDate(fromDate)}</Text>
          </TouchableOpacity>
          {showFromPicker && (
            <DateTimePicker
              value={fromDate}
              mode="date"
              display="spinner"
              onChange={(event, date) => {
                setShowFromPicker(false);
                if (date) setFromDate(date);
              }}
            />
          )}

          {/* To Date Picker */}
          <TouchableOpacity style={styles.dateInput} onPress={() => setShowToPicker(true)}>
            <Text style={styles.dateText}>{formatDate(toDate)}</Text>
          </TouchableOpacity>
          {showToPicker && (
            <DateTimePicker
              value={toDate}
              mode="date"
              display="spinner"
              onChange={(event, date) => {
                setShowToPicker(false);
                if (date) setToDate(date);
              }}
            />
          )}

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>Cancel</Text>
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
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  dateInput: {
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#007BFF",
    marginBottom: 15,
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    color: "#000",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  submitButton: {
    padding: 10,
    backgroundColor: "#28a745",
    borderRadius: 5,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
  },
  closeButton: {
    padding: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
  closeText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default CustomDateModal;
