import React, { useRef, useMemo, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { AntDesign, Feather } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import WheelScrollPicker from "react-native-wheel-scrollview-picker";
import * as Location from 'expo-location';

const { height, width } = Dimensions.get("window");

const WalkingScreen: React.FC = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const calorieSheetRef = useRef<BottomSheet>(null);
  const stepSheetRef = useRef<BottomSheet>(null);
  const durationSheetRef = useRef<BottomSheet>(null);
  const mapRef = useRef<MapView>(null);

  const snapPoints = useMemo(() => ["45%"], []);
  const [isSetTargetVisible, setSetTargetVisible] = useState<boolean>(true);
  const [isCalorieSheetVisible, setCalorieSheetVisible] = useState<boolean>(false);
  const [isStepSheetVisible, setStepSheetVisible] = useState<boolean>(false);
  const [isDurationSheetVisible, setDurationSheetVisible] = useState<boolean>(false);
  const [isDropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>("");

  // Location tracking
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [locations, setLocations] = useState<Location.LocationObject[]>([]);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [watchId, setWatchId] = useState<Location.LocationSubscription | null>(null);
  const [distance, setDistance] = useState<number>(0);

  // Calorie Target
  const [calorieTarget, setCalorieTarget] = useState<string>("");
  const [calorieProgress, setCalorieProgress] = useState<number>(0);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isStopped, setIsStopped] = useState<boolean>(false);

  // Step Target
  const [stepTarget, setStepTarget] = useState<string>("");
  const [stepProgress, setStepProgress] = useState<number>(0);
  const [isStepStarted, setIsStepStarted] = useState<boolean>(false);
  const [isStepPaused, setIsStepPaused] = useState<boolean>(false);
  const [isStepStopped, setIsStepStopped] = useState<boolean>(false);
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

  // Get current location on mount
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location);
      setLocations([location]);
    })();
  }, []);

  // Calculate distance when locations change
  useEffect(() => {
    if (locations.length < 2) return;

    const newDistance = calculateDistance(locations);
    setDistance(newDistance);

    // Check if target is achieved based on current mode
    if (isCalorieSheetVisible && isStarted && calorieTarget) {
      const targetCalories = parseFloat(calorieTarget);
      const estimatedCalories = newDistance * 0.05; // Simplified calculation (0.05 calories per meter)
      const progress = Math.min((estimatedCalories / targetCalories) * 100, 100);
      setCalorieProgress(progress);

      if (progress >= 100) {
        handleCalorieStop();
        Alert.alert("Target Achieved", "You've reached your calorie target!");
      }
    }

    if (isStepSheetVisible && isStepStarted && stepTarget && value) {
      const targetDistance = parseFloat(stepTarget);
      const actualDistance = value === "Km" ? newDistance / 1000 : newDistance;
      const progress = Math.min((actualDistance / targetDistance) * 100, 100);
      setStepProgress(progress);

      if (progress >= 100) {
        handleStepStop();
        Alert.alert("Target Achieved", "You've reached your step target!");
      }
    }
  }, [locations]);

  // Duration timer effect
  useEffect(() => {
    if (isDurationStarted && !isDurationPaused) {
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      if (totalSeconds === 0) return;

      const interval = setInterval(() => {
        setDurationProgress(prev => {
          const newProgress = prev + (100 / totalSeconds);
          if (newProgress >= 100) {
            clearInterval(interval);
            handleDurationStop();
            Alert.alert("Target Achieved", "You've completed your duration target!");
            return 100;
          }
          return newProgress;
        });
      }, 1000);

      setDurationTimer(interval);
      return () => clearInterval(interval);
    }
  }, [isDurationStarted, isDurationPaused, hours, minutes, seconds]);

  // Calculate distance between points
  const calculateDistance = (points: Location.LocationObject[]) => {
    let totalDistance = 0;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      totalDistance += haversineDistance(
        prev.coords.latitude,
        prev.coords.longitude,
        curr.coords.latitude,
        curr.coords.longitude
      );
    }
    return totalDistance;
  };

  // Haversine formula to calculate distance between two coordinates
  const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c * 1000; // Distance in meters
  };

  // Start location tracking
  const startTracking = async () => {
    setIsTracking(true);
    try {
      const id = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (location) => {
          setCurrentLocation(location);
          setLocations(prev => [...prev, location]);
          
          // Center map on current location
          mapRef.current?.animateToRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      );
      setWatchId(id);
    } catch (error) {
      console.error("Error starting location tracking:", error);
      setIsTracking(false);
    }
  };

  // Stop location tracking
  const stopTracking = () => {
    setIsTracking(false);
    if (watchId) {
      watchId.remove();
      setWatchId(null);
    }
  };

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
  const handleCalorieStart = async () => {
    if (!calorieTarget) return;
    setIsStarted(true);
    setIsPaused(false);
    setIsStopped(false);
    await startTracking();
  };

  const handleCaloriePause = () => {
    setIsPaused(true);
    stopTracking();
  };

  const handleCalorieResume = async () => {
    setIsPaused(false);
    await startTracking();
  };

  const handleCalorieStop = () => {
    setIsStopped(true);
    setIsStarted(false);
    setIsPaused(false);
    stopTracking();
    setCalorieProgress(0);
    setLocations(currentLocation ? [currentLocation] : []);
    setDistance(0);
  };

  // Step Target Functions
  const handleStepStart = async () => {
    if (!stepTarget || !value) return;
    setIsStepStarted(true);
    setIsStepPaused(false);
    setIsStepStopped(false);
    await startTracking();
  };

  const handleStepPause = () => {
    setIsStepPaused(true);
    stopTracking();
  };

  const handleStepResume = async () => {
    setIsStepPaused(false);
    await startTracking();
  };

  const handleStepStop = () => {
    setIsStepStopped(true);
    setIsStepStarted(false);
    setIsStepPaused(false);
    stopTracking();
    setStepProgress(0);
    setLocations(currentLocation ? [currentLocation] : []);
    setDistance(0);
  };

  // Duration Target Functions
  const handleDurationStart = async () => {
    setIsDurationStarted(true);
    setIsDurationPaused(false);
    setIsDurationStopped(false);
    await startTracking();
  };

  const handleDurationPause = () => {
    setIsDurationPaused(true);
    stopTracking();
  };

  const handleDurationResume = async () => {
    setIsDurationPaused(false);
    await startTracking();
  };

  const handleDurationStop = () => {
    setIsDurationStopped(true);
    setIsDurationStarted(false);
    setIsDurationPaused(false);
    stopTracking();
    setDurationProgress(0);
    setLocations(currentLocation ? [currentLocation] : []);
    setDistance(0);
    if (durationTimer) clearInterval(durationTimer);
  };

  return (
    <View style={styles.container}>
      {currentLocation && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation={true}
          followsUserLocation={isTracking}
        >
          {locations.length > 1 && (
            <Polyline
              coordinates={locations.map(loc => ({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
              }))}
              strokeColor="#3ECD7E"
              strokeWidth={4}
            />
          )}
          {currentLocation && (
            <Marker
              coordinate={{
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
              }}
              title="Current Location"
              description={isTracking ? "Tracking in progress" : "Tracking paused"}
            >
              <View style={styles.marker}>
                <View style={[styles.markerInner, { backgroundColor: isTracking ? '#3ECD7E' : '#FFA500' }]} />
              </View>
            </Marker>
          )}
        </MapView>
      )}

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

            <TextInput
              style={styles.input}
              placeholder="Enter the target calorie (Kcal)"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={calorieTarget}
              onChangeText={(text) => setCalorieTarget(text)}
            />

            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${calorieProgress}%` }]}
              />
            </View>

            <Text style={styles.distanceText}>
              Distance: {(distance / 1000).toFixed(2)} km
            </Text>
            <Text style={styles.distanceText}>
              Estimated Calories: {(distance * 0.05).toFixed(2)} kcal
            </Text>

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
              />
            </View>

            {value && (
              <TextInput
                style={styles.stepInput}
                placeholder={`Enter the distance (${value})`}
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={stepTarget}
                onChangeText={(text) => setStepTarget(text)}
              />
            )}

            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${stepProgress}%` }]}
              />
            </View>

            <Text style={styles.distanceText}>
              Distance: {value === "Km" ? (distance / 1000).toFixed(2) : Math.round(distance)} {value}
            </Text>

            {value && !isStepStarted && (
              <TouchableOpacity
                style={styles.stepStartButton}
                onPress={handleStepStart}
              >
                <Text style={styles.startButtonText}>Start</Text>
              </TouchableOpacity>
            )}

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

            <View style={styles.wheelPickerContainer}>
              <WheelScrollPicker
                dataSource={hoursArray}
                selectedIndex={hours}
                onValueChange={(value) => setHours(value || 0)}
                wrapperHeight={80}
                itemHeight={40}
                highlightColor="#3ECD7E"
              />
              <Text style={styles.colonSeparator}>:</Text>
              <WheelScrollPicker
                dataSource={minutesArray}
                selectedIndex={minutes}
                onValueChange={(value) => setMinutes(value || 0)}
                wrapperHeight={80}
                itemHeight={40}
                highlightColor="#3ECD7E"
              />
              <Text style={styles.colonSeparator}>:</Text>
              <WheelScrollPicker
                dataSource={secondsArray}
                selectedIndex={seconds}
                onValueChange={(value) => setSeconds(value|| 0)}
                wrapperHeight={80}
                itemHeight={40}
                highlightColor="#3ECD7E"
              />
            </View>

            <Text style={styles.selectedTimeText}>
              Selected Time: {String(hours).padStart(2, "0")}:
              {String(minutes).padStart(2, "0")}:
              {String(seconds).padStart(2, "0")}
              (HH:MM:SS)
            </Text>

            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${durationProgress}%` }]}
              />
            </View>

            <Text style={styles.distanceText}>
              Distance: {(distance / 1000).toFixed(2)} km
            </Text>

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
  map: { width: "100%", height: "70%" },

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
    marginBottom: 10,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    height: 100,
  },
  colonSeparator: {
    fontSize: 24,
    marginHorizontal: 0,
    color: "#000",
  },

  // Selected Time Text
  selectedTimeText: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10,
  },

  // Distance Text
  distanceText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },

  // Marker Styles
  marker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
});

export default WalkingScreen;