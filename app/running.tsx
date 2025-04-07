import React, { useRef, useMemo, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { AntDesign, Feather } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import WheelScrollPicker from "react-native-wheel-scrollview-picker";

const { height, width } = Dimensions.get("window");

const running: React.FC = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const calorieSheetRef = useRef<BottomSheet>(null);
  const stepSheetRef = useRef<BottomSheet>(null);
  const durationSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ["45%"], []);
  const [isSetTargetVisible, setSetTargetVisible] = useState<boolean>(true);
  const [isCalorieSheetVisible, setCalorieSheetVisible] = useState<boolean>(false);
  const [isStepSheetVisible, setStepSheetVisible] = useState<boolean>(false);
  const [isDurationSheetVisible, setDurationSheetVisible] = useState<boolean>(false);
  const [isDropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>("");

  // Calorie Target
  const [calorieTarget, setCalorieTarget] = useState<string>("");
  const [calorieProgress, setCalorieProgress] = useState<number>(0);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isStopped, setIsStopped] = useState<boolean>(false);
  const [calorieTimer, setCalorieTimer] = useState<NodeJS.Timeout | null>(null);

  // Step Target
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [stepTarget, setStepTarget] = useState<string>("");
  const [stepProgress, setStepProgress] = useState<number>(0);
  const [isStepStarted, setIsStepStarted] = useState<boolean>(false);
  const [isStepPaused, setIsStepPaused] = useState<boolean>(false);
  const [isStepStopped, setIsStepStopped] = useState<boolean>(false);
  const [stepTimer, setStepTimer] = useState<NodeJS.Timeout | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string | null>(null);
  const [items, setItems] = useState<{ label: string; value: string }[]>([
    { label: "Km", value: "Km" },
    { label: "M", value: "M" },
  ]);

  // Duration Target
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [durationProgress, setDurationProgress] = useState<number>(0);
  const [isDurationStarted, setIsDurationStarted] = useState<boolean>(false);
  const [isDurationPaused, setIsDurationPaused] = useState<boolean>(false);
  const [isDurationStopped, setIsDurationStopped] = useState<boolean>(false);
  const [durationTimer, setDurationTimer] = useState<NodeJS.Timeout | null>(null);

  // Wheel Picker Items
  const hoursArray = Array.from({ length: 24 }, (_, i) => i);
  const minutesArray = Array.from({ length: 60 }, (_, i) => i);
  const secondsArray = Array.from({ length: 60 }, (_, i) => i);

  // Dropdown Options
  const dropdownOptions: string[] = [
    "Set Target",
    "Calorie Target",
    "Step Target",
    "Duration Target",
  ];

  // Handle Dropdown Selection
  const handleDropdownSelect = (option: string) => {
    setSelectedOption(option);
    setDropdownVisible(false);

    setSetTargetVisible(false);
    setCalorieSheetVisible(false);
    setStepSheetVisible(false);
    setDurationSheetVisible(false);

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

  // Calorie Target Functions
  const handleCalorieStart = () => {
    if (!calorieTarget) return;
    setIsStarted(true);
    setIsPaused(false);
    setIsStopped(false);

    const interval = setInterval(() => {
      setCalorieProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 100);

    setCalorieTimer(interval);
  };

  const handleCaloriePause = () => {
    setIsPaused(true);
    if (calorieTimer) clearInterval(calorieTimer);
  };

  const handleCalorieResume = () => {
    setIsPaused(false);

    const interval = setInterval(() => {
      setCalorieProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 100);

    setCalorieTimer(interval);
  };

  const handleCalorieStop = () => {
    setIsStopped(true);
    setIsStarted(false);
    setIsPaused(false);
    if (calorieTimer) clearInterval(calorieTimer);
    setCalorieProgress(0);
  };

  // Step Target Functions
  const handleStepStart = () => {
    if (!stepTarget) return;
    setIsStepStarted(true);
    setIsStepPaused(false);
    setIsStepStopped(false);

    const interval = setInterval(() => {
      setStepProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 100);

    setStepTimer(interval);
  };

  const handleStepPause = () => {
    setIsStepPaused(true);
    if (stepTimer) clearInterval(stepTimer);
  };

  const handleStepResume = () => {
    setIsStepPaused(false);

    const interval = setInterval(() => {
      setStepProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 100);

    setStepTimer(interval);
  };

  const handleStepStop = () => {
    setIsStepStopped(true);
    setIsStepStarted(false);
    setIsStepPaused(false);
    if (stepTimer) clearInterval(stepTimer);
    setStepProgress(0);
  };

  // Duration Target Functions
  const handleDurationStart = () => {
    setIsDurationStarted(true);
    setIsDurationPaused(false);
    setIsDurationStopped(false);

    const interval = setInterval(() => {
      setDurationProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 100);

    setDurationTimer(interval);
  };

  const handleDurationPause = () => {
    setIsDurationPaused(true);
    if (durationTimer) clearInterval(durationTimer);
  };

  const handleDurationResume = () => {
    setIsDurationPaused(false);

    const interval = setInterval(() => {
      setDurationProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 100);

    setDurationTimer(interval);
  };

  const handleDurationStop = () => {
    setIsDurationStopped(true);
    setIsDurationStarted(false);
    setIsDurationPaused(false);
    if (durationTimer) clearInterval(durationTimer);
    setDurationProgress(0);
  };

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
          backgroundStyle={styles.bottomSheetBackground}
        >
          <BottomSheetView style={styles.bottomSheetView}>
            <TouchableOpacity
              style={styles.targetButton}
              onPress={() => setDropdownVisible(!isDropdownVisible)}
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
          backgroundStyle={styles.bottomSheetBackground}
        >
          <BottomSheetView style={styles.bottomSheetView}>
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
              onChangeText={(text) => setCalorieTarget(text)}
            />

            {/* Progress Bar */}
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${calorieProgress}%` }]}
              />
            </View>

            {/* Start / Resume / Pause / Stop Buttons */}
            {!isStarted ? (
              <TouchableOpacity
                style={styles.startButton}
                onPress={handleCalorieStart}
              >
                <Text style={styles.startButtonText}>Start</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.controlButtonsContainer}>
                {isPaused && (
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={handleCalorieResume}
                  >
                    <Feather name="play" size={24} color="#3ECD7E" />
                  </TouchableOpacity>
                )}
                {!isPaused && (
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={handleCaloriePause}
                  >
                    <Feather name="pause" size={24} color="#FFA500" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={handleCalorieStop}
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
          backgroundStyle={styles.bottomSheetBackground}
        >
          <BottomSheetView style={styles.bottomSheetView}>
            <TouchableOpacity
              style={styles.stepTargetButton}
              onPress={() => setDropdownVisible(true)}
            >
              <Text style={styles.stepTargetText}>Step Target</Text>
              <AntDesign name="caretdown" size={14} color="black" />
            </TouchableOpacity>

            {/* DropDownPicker for Unit Selection */}
            <View style={styles.pickerContainer}>
              <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                placeholder="Select the target distance(Km/M)"
                style={styles.picker}
                dropDownContainerStyle={styles.dropDownContainer}
                onChangeValue={(itemValue) => setSelectedUnit(itemValue)}
              />
            </View>

            {/* Input Field with Placeholder Based on Selected Unit */}
            {value && (
              <TextInput
                style={styles.stepInput}
                placeholder={
                  value === "Km"
                    ? "Enter Your distance in Kilo Meter "
                    : "Enter Your distance in Meter"
                }
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={stepTarget}
                onChangeText={(text) => setStepTarget(text)}
              />
            )}

            {/* Start Button with 200px Width and Centered */}
            {value && !isStepStarted && (
              <TouchableOpacity
                style={styles.stepStartButton}
                onPress={handleStepStart}
              >
                <Text style={styles.startButtonText}>Start</Text>
              </TouchableOpacity>
            )}

            {/* Progress Bar */}
            {isStepStarted && (
              <View style={styles.progressBar}>
                <View
                  style={[styles.progressFill, { width: `${stepProgress}%` }]}
                />
              </View>
            )}

            {/* Pause / Resume / Stop Buttons */}
            {isStepStarted && (
              <View style={styles.controlButtonsContainer}>
                {isStepPaused && (
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={handleStepResume}
                  >
                    <Feather name="play" size={24} color="#3ECD7E" />
                  </TouchableOpacity>
                )}
                {!isStepPaused && (
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={handleStepPause}
                  >
                    <Feather name="pause" size={24} color="#FFA500" />
                  </TouchableOpacity>
                )}
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
          backgroundStyle={styles.bottomSheetBackground}
        >
          <BottomSheetView style={styles.bottomSheetView}>
            <TouchableOpacity
              style={styles.durationTargetButton}
              onPress={() => setDropdownVisible(true)}
            >
              <Text style={styles.durationTargetText}>Duration Target</Text>
              <AntDesign name="caretdown" size={20} color="black" />
            </TouchableOpacity>

            {/* Wheel Pickers for Hours, Minutes, Seconds */}
            <View style={styles.wheelPickerContainer}>
              <WheelScrollPicker
                dataSource={hoursArray}
                selectedIndex={hours}
                onValueChange={(value) => setHours(value || 0)}
                wrapperHeight={80}
                // wrapperWidth={100}
                itemHeight={40}
                highlightColor="#3ECD7E"
              />
              <Text style={styles.colonSeparator}>:</Text>
              <WheelScrollPicker
                dataSource={minutesArray}
                selectedIndex={minutes}
                onValueChange={(value) => setMinutes(value || 0)}
                wrapperHeight={80}
                // wrapperWidth={100}
                itemHeight={40}
                highlightColor="#3ECD7E"
              />
              <Text style={styles.colonSeparator}>:</Text>
              <WheelScrollPicker
                dataSource={secondsArray}
                selectedIndex={seconds}
                onValueChange={(value) => setSeconds(value|| 0)}
                wrapperHeight={80}
                // wrapperWidth={100}
                itemHeight={40}
                highlightColor="#3ECD7E"
              />
            </View>

            {/* Selected Time Display */}
            <Text style={styles.selectedTimeText}>
              Selected Time: {String(hours).padStart(2, "0")}:
              {String(minutes).padStart(2, "0")}:
              {String(seconds).padStart(2, "0")}
            </Text>

            {/* Progress Bar */}
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${durationProgress}%` }]}
              />
            </View>

            {/* Start / Resume / Pause / Stop Buttons */}
            {!isDurationStarted ? (
              <TouchableOpacity
                style={styles.startButton}
                onPress={handleDurationStart}
              >
                <Text style={styles.startButtonText}>Start</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.controlButtonsContainer}>
                {isDurationPaused && (
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={handleDurationResume}
                  >
                    <Feather name="play" size={24} color="#3ECD7E" />
                  </TouchableOpacity>
                )}
                {!isDurationPaused && (
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={handleDurationPause}
                  >
                    <Feather name="pause" size={24} color="#FFA500" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={handleDurationStop}
                >
                  <Feather name="stop-circle" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            )}
          </BottomSheetView>
        </BottomSheet>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },

  // BottomSheet Background Style
  bottomSheetBackground: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  // BottomSheetView Style
  bottomSheetView: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },

  // Target Button
  targetButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 25,
    marginBottom: 10,
  },
  targetText: { fontSize: 20, marginRight: 8, color: "#000" },

  // Calorie Target Button
  calorieTargetButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 25,
    marginBottom: 10,
  },
  calorieTargetText: {
    fontSize: 18,
    marginRight: 8,
    color: "#000",
  },

  // Step Target Button
  stepTargetButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 25,
    marginBottom: 10,
  },
  stepTargetText: {
    fontSize: 20,
    marginRight: 8,
    color: "#000",
  },

  // Step Start Button
  stepStartButton: {
    backgroundColor: "#3ECD7E",
    padding: 15,
    borderRadius: 10,
    width: 200,
    alignItems: "center",
    marginBottom: 20,
    alignSelf: "center",
  },

  // Duration Target Button
  durationTargetButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 25,
    marginBottom: 10,
  },
  durationTargetText: {
    fontSize: 18,
    marginRight: 8,
    color: "#000",
  },

  // Picker Container
  pickerContainer: {
    width: "80%",
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  picker: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  dropDownContainer: {
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },

  // Input Field
  input: {
    width: "80%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    fontSize: 14,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  stepInput: {
    width: "80%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    fontSize: 14,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },

  // Progress Bar
  progressBar: {
    width: "80%",
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3ECD7E",
  },

  // Start Button
  startButton: {
    backgroundColor: "#3ECD7E",
    padding: 15,
    borderRadius: 10,
    width: 200,
    alignItems: "center",
    marginBottom: 20,
    alignSelf: "center",
  },
  startButtonText: {
    color: "black",
    fontSize: 18,
  },

  // Control Buttons
  controlButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginTop: 10,
  },
  controlButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },

  // Dropdown
  dropdown: {
    position: "absolute",
    top: 220,
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
    flexDirection: 'row', // Align children horizontally
    justifyContent: 'space-between', // Space out text and icon
    alignItems: 'center', // Vertically center items
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  dropdownText: {
    fontSize: 16,
  },

  // Wheel Picker Container
  wheelPickerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    height:100,
  },
  colonSeparator: {
    fontSize: 24,
    marginHorizontal: 0,
    color: "#000",
  },

  // Selected Time Text
  selectedTimeText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default running;