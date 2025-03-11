import React, { useState, useRef } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
  const numbers = Array.from({ length: 23 }, (_, i) =>
    (1 + i * 0.5).toFixed(1)
  );

  const [sleepHours, setSleepHours] = useState<string>(currentSleep.toFixed(1));
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    const index = Math.round(yOffset / 50); // Adjusted based on item height
    if (numbers[index]) {
      setSleepHours(numbers[index]);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Set Sleep</Text>
                <MaterialCommunityIcons name="target" size={24} color="#000" />
              </View>

              {/* Goal Container */}
              <View style={styles.goalContainer}>
                <Text style={styles.label}>Hours of Sleep</Text>
                <View style={styles.numberPicker}>
                  <ScrollView
                    ref={scrollViewRef}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={50} // Adjust based on item height
                    onScrollEndDrag={handleScroll}
                    scrollEventThrottle={16}
                    contentContainerStyle={{ paddingVertical: 50 }}
                  >
                    {numbers.map((num) => (
                      <Text
                        key={num}
                        style={[
                          styles.numberText,
                          sleepHours === num ? styles.selectedNumber : {},
                        ]}
                      >
                        {num}
                      </Text>
                    ))}
                  </ScrollView>
                </View>
                <View style={styles.horizontalLineContainer}>
                  <View style={styles.horizontalLine} />
                  <Text style={styles.unitText}>Hrs</Text>
                </View>
              </View>

              {/* OK Button */}
              <TouchableOpacity
                style={styles.okButton}
                onPress={() => onSave(parseFloat(sleepHours))}
              >
                <Text style={styles.okButtonText}>OK</Text>
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
    width: 300,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    alignItems: "flex-start",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
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
    marginTop: 29,
  },
  numberPicker: {
    height: 130,
    width: 60,
    alignItems: "center",
    overflow: "hidden",
  },
  numberText: {
    fontSize: 24,
    color: "#aaa",
    textAlign: "center",
    height: 50,
    lineHeight: 50,
  },
  selectedNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6ad7ff",
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
    marginTop: 29,
  },
  unitText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 29,
  },
  okButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    alignSelf: "flex-end",
  },
  okButtonText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
});

export default SleepTrackerModal;
