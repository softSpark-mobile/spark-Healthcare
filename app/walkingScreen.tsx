import { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { FontAwesome6 } from "@expo/vector-icons";

const WalkingScreen = () => {
  const [target, setTarget] = useState<string>("Set target"); // Persistent selection
  const [tempTarget, setTempTarget] = useState<string>(); // Temporary selection for dropdown
  const [showSheet, setShowSheet] = useState<boolean>(false);
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  const targets = [
    "Set target",
    "Calories target",
    "Steps target",
    "Duration target",
  ]; // Ensure "Set target" is first

  const openSheet = () => {
    setShowSheet(true);
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeSheet = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.5,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowSheet(false));
  };

  const handleSelectTarget = (selected: string) => {
    setTarget(selected); // Set the persistent selection
    setTempTarget(selected);
    closeSheet();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.selectedTargetText}>Target: {target}</Text>

      <Modal transparent visible={showSheet} animationType="fade">
        <TouchableWithoutFeedback onPress={closeSheet}>
          <View style={styles.fullscreenContainer}>
            <Animated.View
              style={[
                styles.modalContent,
                { transform: [{ scale: scaleAnim }] },
              ]}
            >
              {targets.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.option}
                  onPress={() => handleSelectTarget(item)}
                >
                  <Text style={styles.optionText}>{item}</Text>
                  {(tempTarget === item) && (
                    <FontAwesome6
                      name="check"
                      size={20}
                      color="green"
                      style={styles.checkIcon}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Fixed Bottom Sheet */}
      <View style={styles.fixedBottomSheet}>
        <TouchableOpacity style={styles.dropdownButton} onPress={openSheet}>
          <Text style={styles.label}>{target}</Text>
          <AntDesign
            name="caretdown"
            size={18}
            color="black"
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  selectedTargetText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 40,
    color: "#333",
  },
  fullscreenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "50%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  fixedBottomSheet: {
    height: "30%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: "center",
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 40,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
  },
  icon: {
    marginLeft: 5,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    width: "100%",
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
  checkIcon: {
    marginLeft: 10,
  },
});

export default WalkingScreen;
