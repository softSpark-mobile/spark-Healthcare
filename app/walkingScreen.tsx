import React, { useRef, useMemo, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { AntDesign, Feather } from "@expo/vector-icons";

const { height, width } = Dimensions.get("window");

const WalkingScreen = () => {
  const bottomSheetRef = useRef(null);
  const calorieSheetRef = useRef(null);
  const stepSheetRef = useRef(null);
  const durationSheetRef = useRef(null);

  const snapPoints = useMemo(() => ["30%"], []); // Fixed Height
  const [isSetTargetVisible, setSetTargetVisible] = useState(true); // Default Visible
  const [isCalorieSheetVisible, setCalorieSheetVisible] = useState(false);
  const [isStepSheetVisible, setStepSheetVisible] = useState(false);
  const [isDurationSheetVisible, setDurationSheetVisible] = useState(false);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  // Calorie
  const [calorieTarget, setCalorieTarget] = useState(""); // Calorie Input Value
  const [calorieProgress, setCalorieProgress] = useState(0); // Progress Bar Value
  const [isStarted, setIsStarted] = useState(false); // Track if the calorie target is started
  const [isPaused, setIsPaused] = useState(false); // Track if the calorie target is paused
  const [isStopped, setIsStopped] = useState(false); // Track if the calorie target is stopped

  // Step
  const [stepDropDownVisible, setStepDropDownVisible] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState("Km");
  const [stepTarget, setStepTarget] = useState(""); // Step Input Value
  const [stepProgress, setStepProgress] = useState(0); // Progress Bar Value
  const [isStepStarted, setIsStepStarted] = useState(false); // Track if the step target is started
  const [isStepPaused, setIsStepPaused] = useState(false); // Track if the step target is paused
  const [isStepStopped, setIsStepStopped] = useState(false); // Track if the step target is stopped

  // Timer for progress simulation
  const [timer, setTimer] = useState(null);
  const [stepTimer, setStepTimer] = useState(null);

  const dropdownOptions = [
    "Set Target",
    "Calorie Target",
    "Step Target",
    "Duration Target",
  ];

  const handleDropdownSelect = (option) => {
    setSelectedOption(option);
    setDropdownVisible(false);

    // Close all sheets first
    setSetTargetVisible(false);
    setCalorieSheetVisible(false);
    setStepSheetVisible(false);
    setDurationSheetVisible(false);

    // Open only the selected sheet
    if (option === "Set Target") {
      setSetTargetVisible(true);
    } else if (option === "Calorie Target") {
      setCalorieSheetVisible(true);
    } else if (option === "Step Target") {
      setStepSheetVisible(true);
    } else if (option === "Duration Target") {
      setDurationSheetVisible(true);
    }
  };

  const handleStart = () => {
    setIsStarted(true); // Start the calorie target
    setIsPaused(false); // Ensure it's not paused
    setIsStopped(false); // Ensure it's not stopped

    // Start the progress simulation
    const interval = setInterval(() => {
      setCalorieProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval); // Stop the timer when progress reaches 100%
          return 100;
        }
        return prevProgress + 1; // Increment progress by 1% every 100ms
      });
    }, 100); // Update progress every 100ms

    setTimer(interval); // Save the timer ID
  };

  const handlePause = () => {
    setIsPaused(true); // Pause the calorie target
    clearInterval(timer); // Stop the timer
  };

  const handleResume = () => {
    setIsPaused(false); // Resume the calorie target

    // Restart the progress simulation
    const interval = setInterval(() => {
      setCalorieProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval); // Stop the timer when progress reaches 100%
          return 100;
        }
        return prevProgress + 1; // Increment progress by 1% every 100ms
      });
    }, 100); // Update progress every 100ms

    setTimer(interval); // Save the timer ID
  };

  const handleStop = () => {
    setIsStopped(true); // Stop the calorie target
    setIsStarted(false); // Reset started state
    setIsPaused(false); // Reset paused state
    clearInterval(timer); // Stop the timer
    setCalorieProgress(0); // Reset progress to 0%
  };

  const handleStepStart = () => {
    setIsStepStarted(true); // Start the step target
    setIsStepPaused(false); // Ensure it's not paused
    setIsStepStopped(false); // Ensure it's not stopped

    // Start the progress simulation
    const interval = setInterval(() => {
      setStepProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval); // Stop the timer when progress reaches 100%
          return 100;
        }
        return prevProgress + 1; // Increment progress by 1% every 100ms
      });
    }, 100); // Update progress every 100ms

    setStepTimer(interval); // Save the timer ID
  };

  const handleStepPause = () => {
    setIsStepPaused(true); // Pause the step target
    clearInterval(stepTimer); // Stop the timer
  };

  const handleStepResume = () => {
    setIsStepPaused(false); // Resume the step target

    // Restart the progress simulation
    const interval = setInterval(() => {
      setStepProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval); // Stop the timer when progress reaches 100%
          return 100;
        }
        return prevProgress + 1; // Increment progress by 1% every 100ms
      });
    }, 100); // Update progress every 100ms

    setStepTimer(interval); // Save the timer ID
  };

  const handleStepStop = () => {
    setIsStepStopped(true); // Stop the step target
    setIsStepStarted(false); // Reset started state
    setIsStepPaused(false); // Reset paused state
    clearInterval(stepTimer); // Stop the timer
    setStepProgress(0); // Reset progress to 0%
  };

  // Cleanup the timers when the component unmounts
  useEffect(() => {
    return () => {
      if (timer) clearInterval(timer);
      if (stepTimer) clearInterval(stepTimer);
    };
  }, [timer, stepTimer]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
          title="Current Location"
          description="You are here"
        />
      </MapView>

      {/* DROPDOWN (Positioned at the Top) */}
      {isDropdownVisible && (
        <View style={styles.dropdown}>
          {dropdownOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.dropdownItem}
              onPress={() => handleDropdownSelect(option)}
            >
              <Text style={styles.dropdownText}>{option}</Text>
              {selectedOption === option && (
                <Feather name="check" size={20} color="green" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Set Target BottomSheet (Default Visible) */}
      {isSetTargetVisible && (
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          enablePanDownToClose={false}
          enableContentPanningGesture={false}
        >
          <BottomSheetView style={styles.bottomSheetContent}>
            <TouchableOpacity
              style={styles.targetButton}
              onPress={() => setDropdownVisible(!isDropdownVisible)} // Toggle dropdown visibility
            >
              <Text style={styles.targetText}>Set Target</Text>
              <AntDesign name="caretdown" size={20} color="black" />
            </TouchableOpacity>
          </BottomSheetView>
        </BottomSheet>
      )}

      {/* Calorie Target BottomSheet */}
      {isCalorieSheetVisible && (
        <BottomSheet
          ref={calorieSheetRef}
          index={0}
          snapPoints={snapPoints}
          enablePanDownToClose={false}
          enableContentPanningGesture={false}
        >
          <BottomSheetView style={styles.bottomSheetContent}>
            <TouchableOpacity
              style={styles.calorieTargetButton}
              onPress={() => setDropdownVisible(true)}
            >
              <Text style={styles.calorieTargetText}>Calorie Target</Text>
              <AntDesign name="caretdown" size={20} color="black" />
            </TouchableOpacity>

            {/* Calorie Input Field */}
            <TextInput
              style={styles.input}
              placeholder="Enter the target calorie (Kcal)"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={calorieTarget}
              onChangeText={(text) => {
                setCalorieTarget(text);
              }}
            />

            {/* Horizontal Progress Bar */}
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${calorieProgress}%` }]}
              />
            </View>

            {/* Start / Resume / Pause / Stop Buttons */}
            {!isStarted ? (
              <TouchableOpacity
                style={styles.startButton}
                onPress={handleStart}
              >
                <Text style={styles.startButtonText}>Start</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.controlButtonsContainer}>
                {/* Resume Button (Visible only when paused) */}
                {isPaused && (
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={handleResume}
                  >
                    <Feather name="play" size={24} color="#3ECD7E" />
                  </TouchableOpacity>
                )}

                {/* Pause Button (Visible only when not paused) */}
                {!isPaused && (
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={handlePause}
                  >
                    <Feather name="pause" size={24} color="#FFA500" />
                  </TouchableOpacity>
                )}

                {/* Stop Button (Always visible when started) */}
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={handleStop}
                >
                  <Feather name="stop-circle" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            )}
          </BottomSheetView>
        </BottomSheet>
      )}

      {/* Step Target BottomSheet */}
      {isStepSheetVisible && (
        <BottomSheet
          ref={stepSheetRef}
          index={0}
          snapPoints={snapPoints}
          enablePanDownToClose={false}
          enableContentPanningGesture={false}
        >
          <BottomSheetView style={styles.bottomSheetContent}>
            <TouchableOpacity
              style={styles.stepTargetButton}
              onPress={() => setDropdownVisible(true)}
            >
              <Text style={styles.stepTargetText}>Step Target</Text>
              <AntDesign name="caretdown" size={20} color="black" />
            </TouchableOpacity>

            {/* Step Unit Dropdown */}
            <TouchableOpacity
              style={styles.stepUnitDropdown}
              onPress={() => setStepDropDownVisible(!stepDropDownVisible)}
            >
              <Text style={styles.stepUnitText}>{selectedUnit}</Text>
              <AntDesign name="caretdown" size={20} color="black" />
            </TouchableOpacity>

            {stepDropDownVisible && (
              <View style={styles.stepUnitOptions}>
                <TouchableOpacity
                  style={styles.stepUnitOption}
                  onPress={() => {
                    setSelectedUnit("Km");
                    setStepDropDownVisible(false);
                  }}
                >
                  <Text style={styles.stepUnitOptionText}>Km</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.stepUnitOption}
                  onPress={() => {
                    setSelectedUnit("M");
                    setStepDropDownVisible(false);
                  }}
                >
                  <Text style={styles.stepUnitOptionText}>M</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Step Input Field */}
            <TextInput
              style={styles.input}
              placeholder={`Enter the target steps (${selectedUnit})`}
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={stepTarget}
              onChangeText={(text) => {
                setStepTarget(text);
              }}
            />

            {/* Start Button */}
            {!isStepStarted && (
              <TouchableOpacity
                style={styles.startButton}
                onPress={handleStepStart}
              >
                <Text style={styles.startButtonText}>Start</Text>
              </TouchableOpacity>
            )}

            {/* Progress Bar */}
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${stepProgress}%` }]}
              />
            </View>

            {/* Resume / Pause / Stop Buttons */}
            {isStepStarted && (
              <View style={styles.controlButtonsContainer}>
                {/* Resume Button (Visible only when paused) */}
                {isStepPaused && (
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={handleStepResume}
                  >
                    <Feather name="play" size={24} color="#3ECD7E" />
                  </TouchableOpacity>
                )}

                {/* Pause Button (Visible only when not paused) */}
                {!isStepPaused && (
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={handleStepPause}
                  >
                    <Feather name="pause" size={24} color="#FFA500" />
                  </TouchableOpacity>
                )}

                {/* Stop Button (Always visible when started) */}
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={handleStepStop}
                >
                  <Feather name="stop-circle" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            )}
          </BottomSheetView>
        </BottomSheet>
      )}

      {/* Duration Target BottomSheet */}
      {isDurationSheetVisible && (
        <BottomSheet
          ref={durationSheetRef}
          index={0}
          snapPoints={snapPoints}
          enablePanDownToClose={false}
          enableContentPanningGesture={false}
        >
          <BottomSheetView style={styles.bottomSheetContent}>
            <TouchableOpacity
              style={styles.durationTargetButton}
              onPress={() => setDropdownVisible(true)}
            >
              <Text style={styles.durationTargetText}>Duration Target</Text>
              <AntDesign name="caretdown" size={20} color="black" />
            </TouchableOpacity>

            {/* Add Duration Target related UI components here */}
          </BottomSheetView>
        </BottomSheet>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },

  bottomSheetContent: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },

  targetButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 25,
    marginBottom: 20,
  },

  targetText: { fontSize: 18, marginRight: 8, color: "#000" },
  calorieTargetButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 25,
    marginBottom: 10,
  },
  calorieTargetText: {
    fontSize: 18,
    marginRight: 8,
    color: "#000",
  },
  stepTargetButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 25,
    marginBottom: 10,
  },
  stepTargetText: {
    fontSize: 18,
    marginRight: 8,
    color: "#000",
  },
  durationTargetButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 25,
    marginBottom: 10,
  },
  durationTargetText: {
    fontSize: 18,
    marginRight: 8,
    color: "#000",
  },
  input: {
    width: "70%",
    height: 30,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  progressBar: {
    width: "80%",
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3ECD7E",
  },
  startButton: {
    backgroundColor: "#3ECD7E",
    padding: 3,
    borderRadius: 10,
    width: "30%",
    alignItems: "center",
    marginTop: 5,
  },
  startButtonText: {
    color: "black",
    fontSize: 18,
  },
  controlButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginTop: 20,
  },
  controlButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  dropdown: {
    position: "absolute",
    top: 50,
    left: width * 0.1,
    width: width * 0.8,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
    zIndex: 1000,
    paddingHorizontal: 10,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  dropdownText: { fontSize: 16 },
  stepUnitDropdown: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 25,
    marginBottom: 10,
  },
  stepUnitText: {
    fontSize: 18,
    marginRight: 8,
    color: "#000",
  },
  stepUnitOptions: {
    position: "absolute",
    top: 50,
    left: width * 0.1,
    width: width * 0.8,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
    zIndex: 1000,
    paddingHorizontal: 10,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  stepUnitOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  stepUnitOptionText: { fontSize: 16 },
});

export default WalkingScreen;