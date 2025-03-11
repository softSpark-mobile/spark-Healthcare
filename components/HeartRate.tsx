import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesome } from "@expo/vector-icons"; // For the heart icon
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

interface HeartRateProps {
  onSave: (pulse: string) => void;
}

const HeartRate: React.FC<HeartRateProps> = ({ onSave }) => {
  const [pulse, setPulse] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleSave = () => {
    if (!pulse.trim()) {
      Alert.alert("Error", "Please enter a valid heart rate.");
      return;
    }
    onSave(pulse);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ padding: 20, alignItems: "center", width: "100%" }}>
        {/* Date Picker */}
        <TouchableOpacity
          onPress={() => setShowPicker(true)}
          style={{
            backgroundColor: "#8DB5FF",
            padding: 12,
            borderRadius: 20,
            marginBottom: 15,
            alignItems: "center",
            width: "100%",
          }}
        >
          <Text style={{ fontSize: 16, color: "black" }}>
            Select Date: {date.toDateString()}
          </Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker value={date} mode="date" display="default" onChange={handleDateChange} />
        )}

        {/* Heart Rate Input */}
        <View style={{ width: "100%" }}>
          <Text style={{ fontSize: 18, marginBottom: 5, textAlign: "left" }}>Heart Rate (bpm):</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderRadius: 20,
              borderColor: "#ccc",
              paddingHorizontal: 10,
              width: "100%",
              backgroundColor: "#F5F5F5",
            }}
          >
            <FontAwesome6 name="heart-circle-plus" size={24} color="black" />
            <TextInput
              style={{
                flex: 1,
                height: 40,
                fontSize: 16,
                textAlign: "center", // Placeholder text is centered
              }}
              keyboardType="numeric"
              value={pulse}
              onChangeText={setPulse}
              placeholder="Enter your Heart Rate"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          style={{
            padding: 12,
            backgroundColor: "#F0F0F0",
            borderRadius: 20,
            alignItems: "center",
            width: "60%",
            marginTop: 20,
          }}
        >
          <Text style={{ color: "#000", fontSize: 16 }}>Save</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default HeartRate;
