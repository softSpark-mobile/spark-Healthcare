import React, { useState } from "react";
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
  const numbers = Array.from({ length: 91 }, (_, i) => (1 + i * 0.1).toFixed(1));
  const [litres, setLitres] = useState<string>(currentIntake.toFixed(1));

  const handleScroll = (event: any) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    const index = Math.round(yOffset / 50); // Adjust based on item height
    setLitres(numbers[index]);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      {/* Detect clicks outside modal */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          {/* Prevent modal content from closing when touched */}
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContent}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Set Goal</Text>
                <MaterialCommunityIcons name="target" size={24} color="#000" />
              </View>

              {/* Goal Container */}
              <View style={styles.goalContainer}>
                <Text style={styles.label}>No. of Liters</Text>

                {/* Vertical Number Picker */}
                <View style={styles.numberPicker}>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    snapToInterval={50}
                    onScrollEndDrag={handleScroll}
                    scrollEventThrottle={16}
                    contentContainerStyle={{ paddingVertical: 50 }}
                  >
                    {numbers.map((num) => (
                      <Text
                        key={num}
                        style={[
                          styles.numberText,
                          litres === num ? styles.selectedNumber : {},
                        ]}
                      >
                        {num}
                      </Text>
                    ))}
                  </ScrollView>
                </View>

                {/* Horizontal Line with "L" */}
                <View style={styles.horizontalLineContainer}>
                  <View style={styles.horizontalLine} />
                  <Text style={styles.literText}>L</Text>
                </View>
              </View>

              {/* OK Button */}
              <TouchableOpacity
                style={styles.okButton}
                onPress={() => onSave(parseFloat(litres))}
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
    padding: 10,
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
    backgroundColor: "#6ad7ff",
    marginRight: 30,
    marginTop: 29,
  },
  literText: {
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
    marginLeft: 170,
  },
  okButtonText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
});

export default WaterIntakeModal;
