import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
  StyleSheet,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Pressable,
  StatusBar,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
  MaterialCommunityIcons,
  Feather,
  MaterialIcons,
  Ionicons,
  AntDesign,
  FontAwesome,
} from "@expo/vector-icons";
import FoodModal from "@/components/FoodModal"; // Import FoodModal
import { FontAwesome5 } from "@expo/vector-icons";
import { Svg, Circle } from "react-native-svg";
import * as Progress from "react-native-progress";
import { ProgressBar, MD3Colors, RadioButton } from "react-native-paper";
import WaterIntakeModal from "@/components/WaterIntakeModal"; // Import the modal
import SleepTrackerModal from "@/components/SleepTrackerModal";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import Fontisto from "@expo/vector-icons/Fontisto";
import { router } from "expo-router";
import BloodPressureModel from "@/components/BloodPressureModel";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import HeartRate from "@/components/HeartRate";
import moment from "moment";
import { Picker } from "@react-native-picker/picker";
import { Calendar } from "react-native-calendars";
const EmptyDay = () => <View />;
const Index: React.FC = () => {
  // ----------------------------------------
  // ProgressBar && And DropDown
  // Drop Down
  const [selectedMeal, setSelectedMeal] = useState<string>("Overall");

  // State for Calories and Macronutrients
  const [calorie, setCalorie] = useState<number>(640); // Total calorie intake
  const [gainedCalorie, setGainedCalorie] = useState<number>(200); // Calories gained
  const [protein, setProtein] = useState<number>(200);
  const [carbs, setCarbs] = useState<number>(280);
  const [fat, setFat] = useState<number>(88);

  // Progress Calculation
  const progress = calorie / 1000; // Example calculation (adjust max calorie limit)
  const circumference: number = 2 * Math.PI * 70;
  const strokeDashoffset = useRef(new Animated.Value(circumference)).current;

  useEffect(() => {
    Animated.timing(strokeDashoffset, {
      toValue: circumference * (1 - progress), // Animate based on progress
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [progress]);
  // -------------------------------------

  const [sortIndex, setSortIndex] = useState<number>();
  const [budgetDate, setBudegtDate] = useState<string>("");
  const [checked, setChecked] = useState<string>("");
  const [currentDates, setCurrentDate] = useState(
    moment().startOf("month").startOf("week")
  );
  const [currentDay, setCurrentDay] = useState(moment());
  const [currentQuarterStart, setCurrentQuarterStart] = useState(
    moment().startOf("quarter")
  );
  const [currentChoosedYear, setCurrentChoosedYear] = useState(
    moment().startOf("year")
  );
  const [selectedFomDate, setSelectedFromDate] = useState(
    `${new Date().getFullYear()}-${
      new Date().getMonth() + 1
    }-${new Date().getDate()}`
  );
  const [selectedToDate, setSelectedToDate] = useState<string>("");
  const [isBottomSheetVisible, setIsBottomSheetVisible] =
    useState<boolean>(false); // State for bottom sheet visibility

  const snapPoints = useMemo(
    () => (Platform.OS === "ios" ? ["15%", "58%"] : ["20%", "70%"]),
    []
  );
  const customssnapPoints = useMemo(() => ["15%", "33%"], []);
  const filterbottomSheetModalRef = useRef<BottomSheetModalMethods>(null);
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const modelData = [
    {
      name: "Choose Period ",
      mode: "All",
      mode0: "Custom",
      mode1: "Daily",
      mode2: "Weekly",
      mode3: "Monthly",
      mode4: "Quarterly",
      mode5: "Half-Yearly",
      mode6: "Yearly",
    },
  ];
  const quarterMonths = ["Jan - Mar", "Apr - Jun", "Jul - Sep", "Oct - Dec"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const { startOfWeek, endOfWeek } = useMemo(() => {
    const startOfWeek = currentDates.clone().startOf("week");
    const endOfWeek = currentDates.clone().endOf("week");
    return { startOfWeek, endOfWeek };
  }, [currentDates]);

  const goToPreviousWeek = () =>
    setCurrentDate((prevDate) => prevDate.clone().subtract(1, "week"));

  const goToNextWeek = () =>
    setCurrentDate((prevDate) => prevDate.clone().add(1, "week"));

  const goToPreviousDay = () =>
    setCurrentDay((prevDay) => prevDay.clone().subtract(1, "days"));

  const goToNextDay = () =>
    setCurrentDay((prevDay) => prevDay.clone().add(1, "days"));

  const goToPreviousQuarter = () =>
    setCurrentQuarterStart((prevQuarter) =>
      prevQuarter.clone().subtract(1, "quarters")
    );

  const goToNextQuarter = () =>
    setCurrentQuarterStart((prevQuarter) =>
      prevQuarter.clone().add(1, "quarters")
    );

  const goToPreviousYear = () =>
    setCurrentChoosedYear((prevYear) => prevYear.clone().subtract(1, "year"));
  const goToNextYear = () =>
    setCurrentChoosedYear((prevYear) => prevYear.clone().add(1, "year"));
  const date = new Date();
  const day = date.getDay();
  const month = date.getMonth();
  const year = date.getFullYear();
  const realMonth = month < 9 ? `0${month + 1}` : `${month}`;
  const realDay = day < 9 ? `0${day}` : `${day}`;
  const WholeDate = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;
  const handlePresentModalPress = useCallback(() => {
    setIsBottomSheetVisible(true); // Show the bottom sheet
    filterbottomSheetModalRef.current?.present();
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior={"close"}
      />
    ),
    []
  );

  const SortFunction = useCallback((id: number, value: string) => {
    setChecked(value);
    setSortIndex(id);
    if (value === "zero") {
      // Handle custom modal logic here
      filterbottomSheetModalRef.current?.close(); // Close the first bottom sheet
      customsbottomSheetModalRef.current?.present(); // Open the custom bottom sheet
      return;
    }
    filterbottomSheetModalRef.current?.close();
  }, []);

  const currentMonth = moment().month(); // 0 for January, 11 for December
  const initialHalf = currentMonth < 6 ? 1 : 2; // 1 for Jan-Jun, 2 for Jul-Dec
  const initialHalfYearStart =
    initialHalf === 1
      ? moment().startOf("year")
      : moment().startOf("year").add(6, "months");
  // State for tracking the current half-year
  const [currentHalf, setCurrentHalf] = useState<number>(initialHalf);
  const [currentHalfYearStart, setCurrentHalfYearStart] =
    useState(initialHalfYearStart);
  const goToPreviousHalfYear = () => {
    if (currentHalf === 1) {
      // Move to Jul-Dec of the previous year
      setCurrentHalf(2);
      setCurrentHalfYearStart(
        moment(currentHalfYearStart)
          .subtract(1, "year")
          .startOf("year")
          .add(6, "months")
      );
    } else {
      // Move to Jan-Jun of the current year
      setCurrentHalf(1);
      setCurrentHalfYearStart(moment(currentHalfYearStart).startOf("year"));
    }
  };
  const currentQuarter = Math.ceil((currentQuarterStart.month() + 1) / 3);
  const goToNextHalfYear = () => {
    if (currentHalf === 1) {
      // Move to Jul-Dec of the current year
      setCurrentHalf(2);
      setCurrentHalfYearStart(
        moment(currentHalfYearStart).startOf("year").add(6, "months")
      );
    } else {
      // Move to Jan-Jun of the next year
      setCurrentHalf(1);
      setCurrentHalfYearStart(
        moment(currentHalfYearStart).add(1, "year").startOf("year")
      );
    }
  };
  const handleSheetChanges = useCallback((index: number) => {}, []);
  const renderHeader = (date: moment.Moment) => {
    const headerText = date.toString("MMMM yyyy");
    return (
      <Pressable
        onPress={() => handlePresentModalPress()}
        style={styles.sortIndex1Presable}
      >
        <Text style={styles.sortIndex1PresableText}>{headerText}</Text>
      </Pressable>
    );
  };
  const customsbottomSheetModalRef = useRef<BottomSheetModalMethods>(null);
  const [isFromDate, setIsFromDate] = useState<boolean>(true);
  const [datePicker, setDatePicker] = useState<boolean>(false);
  const [dateToPicker, setDateToPicker] = useState<boolean>(false);
  const [dateControl, setDateControl] = useState<boolean>(false);
  const handleToConfirmDate = async (date: Date) => {
    console.log(date);
    const formattedDate = date.toISOString().split("T")[0];
    setSelectedToDate(formattedDate);
    setDateToPicker(false);
    hideDatePicker();
  };
  const hideDatePicker = () => {
    setDatePicker(false);
  };
  const hideToDatePicker = () => {
    setDateToPicker(false);
  };

  const handleRangeSet = () => {
    const from = new Date(selectedFomDate);
    const to = new Date(selectedToDate);
    if (
      selectedFomDate !== "" &&
      selectedToDate !== "" &&
      selectedFomDate !== selectedToDate &&
      new Date(selectedFomDate) > new Date(selectedToDate) !== true
    ) {
      setSortIndex(7);
      setDateControl(false);
      filterbottomSheetModalRef?.current?.close();
      customsbottomSheetModalRef?.current?.close();
    } else {
      if (new Date(selectedFomDate) > new Date(selectedToDate) !== true) {
        setSortIndex(0);
        setDateControl(false);
        filterbottomSheetModalRef?.current?.close();
        customsbottomSheetModalRef?.current?.close();
      }
    }
    if (new Date(selectedFomDate) > new Date(selectedToDate)) {
      console.log("To date cannot before the end date");
      setDateControl(true);
    }
  };

  const renderBackdropCustom = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior={"close"}
      />
    ),
    []
  );

  const handleCutomsCloseModalPress = useCallback(() => {
    customsbottomSheetModalRef.current?.close();
  }, []);
  const handleConfirmDate = async (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0]; // Format to YYYY-MM-DD
    setSelectedFromDate(formattedDate);
    setDatePicker(false);
    hideDatePicker();
  };
  // ----------------------------------------

  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);
  const [glucoseLevel, setGlucoseLevel] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false); // Modal State

  // Water model class state
  const [waterIntakeBar, setWaterIntakeBar] = useState<number>(2); // Default to 2 Litres
  const [waterModalVisible, setWaterModalVisible] = useState<boolean>(false);

  // Sleep
  // const [sleepHours, setSleepHours] = useState<number>(7);

  // sleep Model class
  const [sleepHours, setSleepHours] = useState(7);
  const [isSleepModalVisible, setSleepModalVisible] = useState(false);
  //   ProgressBar
  const [progressAnim] = useState(new Animated.Value(0));

  //Walk status
  const [workoutType, setWorkoutType] = useState<string>("Start Workout");
  const [steps, setSteps] = useState<number>(468);
  const [time, setTime] = useState<number>(5);
  const [calories, setCalories] = useState<number>(300);

  // Blood Pressure
  const [systolic, setSystolic] = useState<number | null>(null);
  const [diastolic, setDiastolic] = useState<number | null>(null);
  const [isBloodPressureModalVisible, setBloodPressureModalVisible] =
    useState<boolean>(false);

  // Heart Rate
  const [heartRate, setHeartRate] = useState<string | null>(null);
  const [isHeartRateModalVisible, setHeartRateModalVisible] = useState(false);

  // Workout
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 75, // Target progress percentage
      duration: 1000, // Animation duration (1 second)
      useNativeDriver: false,
    }).start();
  }, []);
  // Show Date Picker
  const showDatePicker = () => setDatePickerVisibility(true);

  // Water
  const waterIntake = 2.1; // Current water intake
  const goal = 3.0; // Water goal in litres
  const progressWater = waterIntake / goal; // Calculate progress percentage

  // Glucose level
  const handlePress = () => {
    router.push("/(drawer)/(tabs)/(activityStack)/activityScreen");
  };

  // Blood Pressure
  const handleBloodPressureAddPress = (): void => {
    setBloodPressureModalVisible(true); // Show modal when clicking Add button
  };

  const handleCloseModal = (): void => {
    setBloodPressureModalVisible(false); // Close modal when clicking Cancel
  };

  const handleSave = (newSystolic: number, newDiastolic: number): void => {
    setSystolic(newSystolic);
    setDiastolic(newDiastolic);
    setBloodPressureModalVisible(false); // Close modal after saving
  };

  //Heart Rate
  const handleHeartRateAddPress = () => {
    setHeartRateModalVisible(true);
  };

  const handleHeartRateSave = (pulse: string) => {
    setHeartRate(pulse);
    setHeartRateModalVisible(false);
  };

  const handleHeartRateCancel = () => {
    setHeartRateModalVisible(false);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F7F7F7",
        // paddingHorizontal: 20,
        // paddingVertical: 10,
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Glucose Input */}

        {/* Progress DashBoard Start */}
        <View
          style={{ flex: 1, position: "relative", backgroundColor: "white" }}
        >
          <StatusBar backgroundColor={"#D3D3D3"} />
          <View style={{}}>
            {sortIndex === 1 ? (
              <Calendar
                style={styles.sortIndex1}
                current={WholeDate}
                hideExtraDays={true}
                disableMonthChange={true}
                onDayPress={(day) => {
                  console.log("selected day", day);
                }}
                hideDayNames={true}
                hideDayNumbers={true}
                renderHeader={renderHeader}
                dayComponent={EmptyDay}
                headerStyle={{ backgroundColor: "#48158A" }}
                renderArrow={(direction) => (
                  <AntDesign
                    name={direction === "left" ? "caretleft" : "caretright"} // Corrected icon names
                    size={24} // Adjust size here
                    color="white"
                    style={{ paddingHorizontal: 20 }} // Adjusts spacing
                  />
                )}
                theme={{
                  monthTextColor: "white",
                  arrowColor: "white",
                  textMonthFontWeight: "bold",
                  textMonthFontSize: 18,
                  arrowStyle: {
                    paddingHorizontal: 50,
                    bottom: 0,
                  },
                }}
              />
            ) : sortIndex === 2 ? (
              // Weekly
              <Pressable
                onPress={() => handlePresentModalPress()}
                style={styles.sortIndex2Presable}
              >
                {/* Left Arrow */}
                <TouchableOpacity onPress={goToPreviousWeek}>
                  <AntDesign name="caretleft" size={24} color="white" />
                </TouchableOpacity>

                {/* Display the current week range */}
                <Text style={styles.sortIndex2DateText}>
                  {startOfWeek.format("MMM D")} - {endOfWeek.format("MMM D")}
                </Text>

                {/* Right Arrow */}
                <TouchableOpacity onPress={goToNextWeek}>
                  <AntDesign name="caretright" size={24} color="white" />
                </TouchableOpacity>
              </Pressable>
            ) : sortIndex === 3 ? (
              // Daily
              <Pressable
                onPress={() => handlePresentModalPress()}
                style={styles.sortIndex2Presable}
              >
                {/* Left Arrow */}
                <TouchableOpacity onPress={goToPreviousDay}>
                  <AntDesign name="caretleft" size={24} color="white" />
                </TouchableOpacity>
                {/* Display the current day */}
                <Text
                  style={{ fontSize: 18, fontWeight: "bold", color: "white" }}
                >
                  {currentDay.format("MMM D, YYYY")}
                </Text>
                {/* Right Arrow */}
                <TouchableOpacity onPress={goToNextDay}>
                  <AntDesign name="caretright" size={24} color="white" />
                </TouchableOpacity>
              </Pressable>
            ) : sortIndex === 4 ? (
              // Quarterly
              <Pressable
                onPress={() => handlePresentModalPress()}
                style={styles.sortIndex2Presable}
              >
                {/* Left Arrow */}
                <TouchableOpacity onPress={goToPreviousQuarter}>
                  <AntDesign name="caretleft" size={24} color="white" />
                </TouchableOpacity>
                {/* Display the current quarter with month range */}
                <Text
                  style={{ fontSize: 18, fontWeight: "bold", color: "white" }}
                >
                  {`${
                    quarterMonths[currentQuarter - 1]
                  } ${currentQuarterStart.year()}`}
                </Text>
                {/* Right Arrow */}
                <TouchableOpacity onPress={goToNextQuarter}>
                  <AntDesign name="caretright" size={24} color="white" />
                </TouchableOpacity>
              </Pressable>
            ) : sortIndex === 5 ? (
              // Half-yearly view
              <Pressable
                onPress={() => handlePresentModalPress()}
                style={styles.sortIndex2Presable}
              >
                {/* Left Arrow */}
                <TouchableOpacity onPress={goToPreviousHalfYear}>
                  <AntDesign name="caretleft" size={24} color="white" />
                </TouchableOpacity>

                {/* Display the current half-year range */}
                <Text
                  style={{ fontSize: 18, fontWeight: "bold", color: "white" }}
                >
                  {currentHalf === 1
                    ? `Jan - Jun ${currentHalfYearStart.year()}`
                    : `Jul - Dec ${currentHalfYearStart.year()}`}
                </Text>
                {/* Right Arrow */}
                <TouchableOpacity onPress={goToNextHalfYear}>
                  <AntDesign name="caretright" size={24} color="white" />
                </TouchableOpacity>
              </Pressable>
            ) : sortIndex === 6 ? (
              // Year
              <Pressable
                style={styles.sortIndex2Presable}
                onPress={() => handlePresentModalPress()}
              >
                {/* Left Arrow */}
                <TouchableOpacity onPress={goToPreviousYear}>
                  <AntDesign name="caretleft" size={24} color="white" />
                </TouchableOpacity>
                <Text
                  style={{ fontSize: 18, fontWeight: "bold", color: "white" }}
                >
                  {moment(currentChoosedYear).format("YYYY")}
                </Text>
                {/* Right Arrow */}
                <TouchableOpacity onPress={goToNextYear}>
                  <AntDesign name="caretright" size={24} color="white" />
                </TouchableOpacity>
              </Pressable>
            ) : (
              <Pressable
                style={styles.sortIndex2Presable}
                onPress={() => handlePresentModalPress()}
              >
                <AntDesign name="caretleft" size={24} color="white" />
                {/* Left Arrow */}
                <Text
                  style={{ fontSize: 18, fontWeight: "bold", color: "white" }}
                >
                  {selectedFomDate !== "" && selectedToDate === ""
                    ? `${
                        months[new Date(selectedFomDate).getMonth()]
                      } ${new Date(selectedFomDate).getDate()}, ${new Date(
                        selectedFomDate
                      ).getFullYear()}`
                    : selectedFomDate === selectedToDate
                    ? `${
                        months[new Date(selectedFomDate).getMonth()]
                      } ${new Date(selectedFomDate).getDate()}, ${new Date(
                        selectedFomDate
                      ).getFullYear()}`
                    : `${
                        months[new Date(selectedFomDate).getMonth()]
                      } ${new Date(selectedFomDate).getDate()}, ${new Date(
                        selectedFomDate
                      ).getFullYear()} - ${
                        months[new Date(selectedToDate).getMonth()]
                      } ${new Date(selectedToDate).getDate()}, ${new Date(
                        selectedToDate
                      ).getFullYear()}`}
                </Text>
                <AntDesign name="caretright" size={24} color="white" />
              </Pressable>
            )}

            <>
              <BottomSheetModal
                ref={filterbottomSheetModalRef}
                index={1}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                enableContentPanningGesture={false}
                backdropComponent={renderBackdrop}
              >
                <BottomSheetView>
                  {modelData.map((data, index) => (
                    <View key={index} style={styles.filteroveral}>
                      <View style={styles.filtercontent}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "bold",
                            color: "#10680E",
                          }}
                        >
                          {data.name}
                        </Text>
                        <Pressable
                          aria-label="BottomSheet Close"
                          onPress={() => {
                            filterbottomSheetModalRef.current?.close();
                          }}
                        >
                          <Fontisto name="close-a" size={24} color="black" />
                        </Pressable>
                      </View>
                      <View
                        style={{
                          borderColor: "#AEABAB",
                          borderWidth: 0.3,
                          width: "88%",
                          alignSelf: "center",
                          right: 3,
                        }}
                      />
                      <View style={styles.filtercontent} aria-label="Custom">
                        <Text style={{ color: "#10680E" }}>{data.mode0}</Text>
                        <RadioButton.Android
                          color="#391D8B"
                          value="zero"
                          status={checked === "zero" ? "checked" : "unchecked"}
                          onPress={() => SortFunction(0, "zero")}
                        />
                      </View>
                      <View
                        style={{
                          borderColor: "#AEABAB",
                          borderWidth: 0.3,
                          width: "88%",
                          alignSelf: "center",
                          right: 3,
                        }}
                      />
                      <View style={styles.filtercontent} aria-label="Daily">
                        <Text style={{ color: "#10680E" }}>{data.mode1}</Text>
                        <RadioButton.Android
                          color="#391D8B"
                          value="first"
                          status={checked === "first" ? "checked" : "unchecked"}
                          onPress={() => SortFunction(3, "first")}
                        />
                      </View>
                      <View
                        style={{
                          borderColor: "#AEABAB",
                          borderWidth: 0.3,
                          width: "88%",
                          alignSelf: "center",
                          right: 3,
                        }}
                      />
                      <View style={styles.filtercontent} aria-label="Weekly">
                        <Text style={{ color: "#10680E" }}>{data.mode2}</Text>
                        <RadioButton.Android
                          color="#391D8B"
                          value="second"
                          status={
                            checked === "second" ? "checked" : "unchecked"
                          }
                          onPress={() => SortFunction(2, "second")}
                        />
                      </View>
                      <View
                        style={{
                          borderColor: "#AEABAB",
                          borderWidth: 0.3,
                          width: "88%",
                          alignSelf: "center",
                          right: 3,
                        }}
                      />
                      <View style={styles.filtercontent} aria-label="Monthly">
                        <Text style={{ color: "#10680E" }}>{data.mode3}</Text>
                        <RadioButton.Android
                          color="#391D8B"
                          value="third"
                          status={checked === "third" ? "checked" : "unchecked"}
                          onPress={() => SortFunction(1, "third")}
                        />
                      </View>
                      <View
                        style={{
                          borderColor: "#AEABAB",
                          borderWidth: 0.3,
                          width: "88%",
                          alignSelf: "center",
                          right: 3,
                        }}
                      />
                      <View style={styles.filtercontent} aria-label="Quarterly">
                        <Text style={{ color: "#10680E" }}>{data.mode4}</Text>
                        <RadioButton.Android
                          color="#391D8B"
                          value="fourth"
                          status={
                            checked === "fourth" ? "checked" : "unchecked"
                          }
                          onPress={() => SortFunction(4, "fourth")}
                        />
                      </View>
                      <View
                        style={{
                          borderColor: "#AEABAB",
                          borderWidth: 0.3,
                          width: "88%",
                          alignSelf: "center",
                          right: 3,
                        }}
                      />
                      <View
                        style={styles.filtercontent}
                        aria-label="HalfYearly"
                      >
                        <Text style={{ color: "#10680E" }}>{data.mode5}</Text>
                        <RadioButton.Android
                          color="#391D8B"
                          value="fifth"
                          status={checked === "fifth" ? "checked" : "unchecked"}
                          onPress={() => SortFunction(5, "fifth")}
                        />
                      </View>
                      <View
                        style={{
                          borderColor: "#AEABAB",
                          borderWidth: 0.3,
                          width: "88%",
                          alignSelf: "center",
                          right: 3,
                        }}
                      />
                      <View style={styles.filtercontent} aria-label="Yearly">
                        <Text style={{ color: "#10680E" }}>{data.mode6}</Text>
                        <RadioButton.Android
                          color="#391D8B"
                          value="sixith"
                          status={
                            checked === "sixith" ? "checked" : "unchecked"
                          }
                          onPress={() => SortFunction(6, "sixith")}
                        />
                      </View>
                    </View>
                  ))}
                </BottomSheetView>
              </BottomSheetModal>
              {/* Custome Bottom Sheet  */}
              <BottomSheetModal
                ref={customsbottomSheetModalRef}
                index={1}
                snapPoints={customssnapPoints}
                onChange={handleSheetChanges}
                enableContentPanningGesture={false}
                backdropComponent={renderBackdropCustom}
              >
                <BottomSheetView>
                  <View style={{ padding: 7, gap: 8 }}>
                    <View style={styles.dateRangeOverall}>
                      <Text
                        style={{
                          fontSize: 17,
                          color: "#10680E",
                          fontWeight: "bold",
                        }}
                      >
                        Date Range
                      </Text>
                      <Pressable onPress={handleCutomsCloseModalPress}>
                        <Fontisto name="close-a" size={20} color="black" />
                      </Pressable>
                    </View>
                    <View style={{ padding: 8 }}>
                      <View style={styles.button}>
                        <Text style={styles.buttonText}>From Date: </Text>
                        <TextInput
                          style={styles.fromDate}
                          mode="outlined"
                          value={selectedFomDate}
                          editable={false}
                        />
                        <Pressable
                          onPress={() => {
                            setIsFromDate(true);
                            setDatePicker(true);
                          }}
                        >
                          <Fontisto name="close-a" size={13} color="black" />
                        </Pressable>
                      </View>
                      <DateTimePickerModal
                        isVisible={datePicker}
                        mode="date"
                        onConfirm={handleConfirmDate}
                        onCancel={hideDatePicker}
                      />
                      <View style={styles.toDateOverall}>
                        <Text style={styles.buttonText}>To Date: </Text>
                        <TextInput
                          style={styles.fromDate}
                          mode="outlined"
                          value={
                            selectedFomDate !== ""
                              ? selectedFomDate !== "" && selectedToDate === ""
                                ? selectedFomDate
                                : selectedToDate
                              : `${new Date().getFullYear()}-${
                                  new Date().getMonth() + 1
                                }-${new Date().getDate()}`
                          }
                          editable={false} // Disable manual input
                        />
                        <Pressable
                          onPress={() => {
                            setIsFromDate(false);
                            setDateToPicker(true);
                          }}
                        >
                          <Fontisto name="close-a" size={13} color="black" />
                        </Pressable>
                      </View>
                      <DateTimePickerModal
                        isVisible={dateToPicker}
                        mode="date"
                        onConfirm={handleToConfirmDate}
                        onCancel={hideToDatePicker}
                      />
                    </View>
                    {dateControl && (
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ color: "red", bottom: 8 }}>
                          To date cannot be before the From date
                        </Text>
                      </View>
                    )}
                    <View
                      style={{
                        flexDirection: "row",
                        width: "65%",
                        alignSelf: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Pressable
                        style={styles.customCancelButtonOverall}
                        onPress={() => {
                          handleCutomsCloseModalPress();
                        }}
                      >
                        <Text style={styles.customCancelButtonText}>
                          Cancel
                        </Text>
                      </Pressable>
                      <Pressable
                        style={styles.customeSetOverall}
                        onPress={() => {
                          handleRangeSet();
                        }}
                      >
                        <Text style={styles.customSetButtonText}>Set</Text>
                      </Pressable>
                    </View>
                  </View>
                </BottomSheetView>
              </BottomSheetModal>
            </>
          </View>

          <View>
            {/* Drop Down */}
            <View style={styles.dropdownContainer}>
              <Picker
                selectedValue={selectedMeal}
                onValueChange={(itemValue) => setSelectedMeal(itemValue)}
                mode="dropdown"
                style={styles.picker}
              >
                <Picker.Item label="Overall" value="Overall" />
                <Picker.Item label="Breakfast" value="Breakfast" />
                <Picker.Item label="Morning Snacks" value="Morning Snacks" />
                <Picker.Item label="Lunch" value="Lunch" />
                <Picker.Item label="Evening Snacks" value="Evening Snacks" />
                <Picker.Item label="Dinner" value="Dinner" />
              </Picker>
            </View>

            {/* Progress Container */}
            <View style={styles.progressContainer}>
              {/* Left View */}
              <View style={styles.progressLeftContainer}>
                {/* Top View - Calorie & Fire Icon */}
                <View style={styles.progressHeader}>
                  <Text style={styles.progressTitle}>Calorie</Text>
                  <FontAwesome5 name="fire" size={30} color="white" />
                </View>

                {/* Bottom View - Progress Bar */}
                <View style={styles.progressCircleContainer}>
                  <Svg width={160} height={160} viewBox="0 0 160 160">
                    {/* Background Circle (Unfilled Part) */}
                    <Circle
                      cx="80"
                      cy="80"
                      r={70} // Increased radius for more roundness
                      stroke="#7FD2A4"
                      strokeWidth={12} // Slightly thicker stroke for better appearance
                      fill="none"
                    />
                    {/* Animated Progress Circle (Filled Part) */}
                    <AnimatedCircle
                      cx="80"
                      cy="80"
                      r={70} // Match radius with background circle
                      stroke="white"
                      strokeWidth={12}
                      fill="none"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round" // Ensures smooth, rounded edges
                    />
                  </Svg>
                  {/* Calorie Text (Center of Progress Bar) */}
                  <Text style={styles.progressCalorieText}>640 Kcal</Text>
                </View>
              </View>

              {/* Right View (Empty) */}
              <View style={styles.progressRightView}>
                <View style={styles.progressRightView}>
                  <View style={styles.rightProgressBarContainer}>
                    {/* First Progress Bar - Protein */}
                    <View style={styles.rightProgressBarFirstView}>
                      <View style={styles.rightProgressBarProgressContainer}>
                        <Svg width={60} height={60} viewBox="0 0 60 60">
                          <Circle
                            cx="30"
                            cy="30"
                            r="22"
                            stroke="#E0E0E0"
                            strokeWidth={6}
                            fill="none"
                          />
                          <AnimatedCircle
                            cx="30"
                            cy="30"
                            r="22"
                            stroke="#f65427"
                            strokeWidth={6}
                            fill="none"
                            strokeDasharray={Math.PI * 2 * 22}
                            strokeDashoffset={Math.PI * 2 * 22 * 0.5}
                            strokeLinecap="round"
                          />
                        </Svg>
                      </View>
                      <View style={styles.rightProgressBarTextContainer}>
                        <Text style={styles.rightProgressBarProteinText}>
                          Protein
                        </Text>
                        <Text style={styles.rightProgressBarValueText}>
                          200
                        </Text>
                      </View>
                    </View>

                    {/* Second Progress Bar - Fats */}
                    <View style={styles.rightProgressBarFirstView}>
                      <View style={styles.rightProgressBarProgressContainer}>
                        <Svg width={60} height={60} viewBox="0 0 60 60">
                          <Circle
                            cx="30"
                            cy="30"
                            r="22"
                            stroke="#E0E0E0"
                            strokeWidth={6}
                            fill="none"
                          />
                          <AnimatedCircle
                            cx="30"
                            cy="30"
                            r="22"
                            stroke="#4a27f6"
                            strokeWidth={6}
                            fill="none"
                            strokeDasharray={Math.PI * 2 * 22}
                            strokeDashoffset={Math.PI * 2 * 22 * 0.4}
                            strokeLinecap="round"
                          />
                        </Svg>
                      </View>
                      <View style={styles.rightProgressBarTextContainer}>
                        <Text style={styles.rightProgressBarProteinText}>
                          Fats
                        </Text>
                        <Text style={styles.rightProgressBarValueText}>88</Text>
                      </View>
                    </View>

                    {/* Third Progress Bar - Carbs */}
                    <View style={styles.rightProgressBarFirstView}>
                      <View style={styles.rightProgressBarProgressContainer}>
                        <Svg width={60} height={60} viewBox="0 0 60 60">
                          <Circle
                            cx="30"
                            cy="30"
                            r="22"
                            stroke="#E0E0E0"
                            strokeWidth={6}
                            fill="none"
                          />
                          <AnimatedCircle
                            cx="30"
                            cy="30"
                            r="22"
                            stroke="#27f632"
                            strokeWidth={6}
                            fill="none"
                            strokeDasharray={Math.PI * 2 * 22}
                            strokeDashoffset={Math.PI * 2 * 22 * 0.7}
                            strokeLinecap="round"
                          />
                        </Svg>
                      </View>
                      <View style={styles.rightProgressBarTextContainer}>
                        <Text style={styles.rightProgressBarProteinText}>
                          Carbs
                        </Text>
                        <Text style={styles.rightProgressBarValueText}>
                          280
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        {/* Progress DashBoard End */}
        <View style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}>
          {/* Food Suggestion */}
          <View
            style={{
              flex: 1, // Ensures the container takes up available space
              flexDirection: "row",
              alignSelf: "center",
              alignItems: "center", // Centers content vertically
              justifyContent: "center", // Centers content horizontally
              backgroundColor: "#ffffff",
              padding: 15,
              borderRadius: 10,
            }}
          >
            {/* <MaterialCommunityIcons
              name="silverware-fork-knife"
              size={24}
              color="black"
            /> */}
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              Food suggestions
            </Text>

            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "#3ECD7E",
                borderRadius: 20,
                paddingVertical: 10,
                paddingHorizontal: 15,
                marginLeft: 15,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={handlePress} // Replace with your function
            >
              <Text style={{ fontSize: 16, color: "#FFF" }}>
                Enter Glucose Level
              </Text>
            </TouchableOpacity>

            {/* <Text style={{ fontSize: 16, fontWeight: "bold", marginLeft: 10 }}>
              (mg/dl)
            </Text> */}
          </View>

          {/* Sleep and Water */}
          <View style={styles.mainContainer}>
            {/* Water Tracker Card - Left Side */}
            <TouchableOpacity
              style={{ width: "50%" }}
              onPress={() => setWaterModalVisible(true)}
              activeOpacity={1} // Prevents opacity change
            >
              <View style={[styles.card, styles.leftCard]}>
                <View style={styles.row}>
                  <Text style={styles.waterText}>Water</Text>
                  <MaterialCommunityIcons
                    name="water"
                    size={24}
                    color="#6ad7ff"
                  />
                </View>
                <View style={styles.amountContainer}>
                  <Text style={styles.litresNumber}>{waterIntakeBar}</Text>
                  <Text style={styles.litresText}>Litres</Text>
                </View>
                {/* Progress Bar */}
                <View style={{ borderRadius: 10, overflow: "hidden" }}>
                  <ProgressBar progress={0.5} color={"#6ad7ff"} />
                </View>
              </View>
            </TouchableOpacity>
            {/* Inject Water Intake Modal */}
            <WaterIntakeModal
              visible={waterModalVisible}
              onClose={() => setWaterModalVisible(false)}
              onSave={(litres) => {
                setWaterIntakeBar(litres);
                setWaterModalVisible(false);
              }}
              currentIntake={waterIntake}
            />

            {/* Sleep Tracker Card - Right Side */}
            <View style={[styles.card, styles.rightCard]}>
              <TouchableOpacity
                style={{ width: "100%" }}
                onPress={() => setSleepModalVisible(true)}
                activeOpacity={1}
              >
                <View style={styles.row}>
                  <Text style={styles.waterText}>Sleep</Text>
                  <MaterialCommunityIcons
                    name="weather-night"
                    size={24}
                    color="#f65427"
                  />
                </View>
                <View style={styles.amountContainer}>
                  <Text style={styles.litresNumber}>{sleepHours}</Text>
                  <Text style={styles.litresText}>Hours</Text>
                </View>
                {/* Progress Bar */}
                <View style={{ borderRadius: 10, overflow: "hidden" }}>
                  <ProgressBar progress={0.7} color={"#3ECD7E"} />
                </View>
              </TouchableOpacity>

              {/* Sleep Tracker Modal */}
              <SleepTrackerModal
                visible={isSleepModalVisible}
                onClose={() => setSleepModalVisible(false)}
                onSave={(hours) => {
                  setSleepHours(hours);
                  setSleepModalVisible(false);
                }}
                currentSleep={sleepHours}
              />
            </View>
          </View>

          {/* Walking Status */}
          <View style={styles.walkStatusContainer}>
            {/* Remove Icon */}
            <TouchableOpacity
              style={styles.removeIcon}
              onPress={() => console.log("Remove Pressed")}
            >
              <MaterialIcons name="highlight-remove" size={24} color="black" />
            </TouchableOpacity>

            {/* Steps View */}
            <View style={styles.walkStatusSubView}>
              <View style={styles.walkStatusLeftContainer}>
                <View
                  style={[
                    styles.walkStatusIconContainer,
                    { backgroundColor: "#27f632" },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="shoe-sneaker"
                    size={24}
                    color="black"
                  />
                </View>
                <Text style={styles.walkStatusText}>{steps} steps</Text>
              </View>
              <View style={styles.walkStatusRightContainer}>
                <ProgressBar
                  progress={steps / 10000}
                  color="#27f632"
                  style={styles.walkStatusProgress}
                />
              </View>
            </View>

            {/* Time View */}
            <View style={styles.walkStatusSubView}>
              <View style={styles.walkStatusLeftContainer}>
                <View
                  style={[
                    styles.walkStatusIconContainer,
                    { backgroundColor: "#10afff" },
                  ]}
                >
                  <FontAwesome5 name="clock" size={20} color="black" />
                </View>
                <Text style={styles.walkStatusText}>{time} mins</Text>
              </View>
              <View style={styles.walkStatusRightContainer}>
                <ProgressBar
                  progress={time / 60}
                  color="#10afff"
                  style={styles.walkStatusProgress}
                />
              </View>
            </View>

            {/* Calories View */}
            <View style={styles.walkStatusSubView}>
              <View style={styles.walkStatusLeftContainer}>
                <View
                  style={[
                    styles.walkStatusIconContainer,
                    { backgroundColor: "#ff78e2" },
                  ]}
                >
                  <FontAwesome5 name="fire" size={20} color="black" />
                </View>
                <Text style={styles.walkStatusText}>{calories} kcal</Text>
              </View>
              <View style={styles.walkStatusRightContainer}>
                <ProgressBar
                  progress={calories / 500}
                  color="#ff78e2"
                  style={styles.walkStatusProgress}
                />
              </View>
            </View>
          </View>

          {/* Workout */}
          <View style={styles.workoutContainer}>
            {/* Start Workout View */}
            <View style={styles.workoutHead}>
              <MaterialCommunityIcons
                name="meditation"
                size={24}
                color="black"
              />
              <Text style={styles.workoutHeadText}>{workoutType}</Text>
            </View>

            {/* Walking View */}
            <TouchableOpacity onPress={() => router.push("/walkingScreen")}>
              <View style={styles.workoutView}>
                <View
                  style={[
                    styles.workoutIconContainer,
                    { backgroundColor: "#eeeeee" },
                  ]}
                >
                  <FontAwesome5 name="walking" size={20} color="black" />
                </View>
                <Text style={styles.workoutText}>Walking</Text>
              </View>
            </TouchableOpacity>

            {/* Running View */}
            <TouchableOpacity onPress={() => router.push("/running")}>
              <View style={styles.workoutView}>
                <View
                  style={[
                    styles.workoutIconContainer,
                    { backgroundColor: "#eeeeee" },
                  ]}
                >
                  <FontAwesome5 name="running" size={20} color="black" />
                </View>
                <Text style={styles.workoutText}>running</Text>
              </View>
            </TouchableOpacity>
            {/* Cycling View */}
            <View style={styles.workoutView}>
              <View
                style={[
                  styles.workoutIconContainer,
                  { backgroundColor: "#eeeeee" },
                ]}
              >
                <Ionicons name="bicycle-sharp" size={24} color="black" />
              </View>
              <Text style={styles.workoutText}>cycling</Text>
            </View>
          </View>

          {/* Blood Pressure  */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              borderRadius: 15,
              padding: 20,
              margin: 10,
              marginLeft: 0,
              marginRight: 0,
            }}
          >
            {/* Left Section: Icon and Text */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Fontisto name="blood-drop" size={24} color="black" />
              <Text style={{ fontSize: 16, marginLeft: 8 }}>
                Blood Pressure
              </Text>
            </View>

            {/* Center Section: Button (Centered Vertically) */}
            <TouchableOpacity
              style={{
                // backgroundColor: "#3ECD7E",
                borderRadius: 10,
                paddingVertical: 8,
                paddingHorizontal: 15,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={handleBloodPressureAddPress}
            >
              <Text style={{ color: "#000", fontSize: 14 }}>Add</Text>
            </TouchableOpacity>
            {/* Blood Pressure Modal */}
            <BloodPressureModel
              visible={isBloodPressureModalVisible}
              onClose={handleCloseModal}
              onSave={handleSave}
            />
            {/* Right Section: SYS/DIA Values */}
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 14, color: "#FF8800" }}>
                SYS:{" "}
                <Text style={{ color: "#000" }}>
                  {systolic ? `${systolic} mmHg` : "-- mmHg"}
                </Text>
              </Text>
              <Text style={{ fontSize: 14, color: "#FF8800" }}>
                DIA:{"  "}
                <Text style={{ color: "#000" }}>
                  {diastolic ? `${diastolic} mmHg` : "-- mmHg"}
                </Text>
              </Text>
            </View>
          </View>

          {/* Heart Rate */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              borderRadius: 15,
              padding: 20,
              // marginTop: 0,
              // paddingTop: 0,
              // margin: 10,
              // marginLeft: 0,
              // marginRight: 0,
              marginBottom: 20,
            }}
          >
            {/* Left Section: Icon and Text */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome5 name="heartbeat" size={24} color="black" />
              <Text style={{ fontSize: 16, marginLeft: 8 }}>Heart Rate</Text>
            </View>

            {/* Center Section: Button (Centered Vertically) */}
            <TouchableOpacity
              style={{
                borderRadius: 10,
                paddingVertical: 8,
                paddingHorizontal: 15,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={handleHeartRateAddPress}
            >
              <Text style={{ color: "#000", fontSize: 14, marginEnd: 15 }}>
                Add
              </Text>
            </TouchableOpacity>

            {/* Right Section: Heart Rate Value */}
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 14, color: "#000" }}>
                {heartRate ? `${heartRate} BPM` : "-- BPM"}
              </Text>
            </View>
          </View>
          {/* Modal for HeartRate Component */}
          <Modal
            visible={isHeartRateModalVisible}
            animationType="slide"
            transparent
          >
            <TouchableWithoutFeedback onPress={handleHeartRateCancel}>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              >
                <TouchableWithoutFeedback onPress={() => {}}>
                  <View
                    style={{
                      backgroundColor: "white",
                      padding: 20,
                      borderRadius: 10,
                      width: "80%",
                    }}
                  >
                    <HeartRate onSave={handleHeartRateSave} />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      </ScrollView>
    </View>
  );
};
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
// const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  // Filters
  sortIndex2Presable: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#48158A",
    padding: 10,
    gap: 60,
  },
  sortIndex2DateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  sortIndex1: {
    height: 50,
    width: "105%",
    alignSelf: "center",
  },
  sortIndex1PresableText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  sortIndex1Presable: {
    flexDirection: "row",
    justifyContent: "center",
    bottom: Platform.OS === "ios" ? 0 : 0,
    height: Platform.OS === "ios" ? 40 : 40,
    top: Platform.OS === "ios" ? 5 : 0,
  },
  filtercontent: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
  },
  filteroveral: {
    gap: 15,
  },
  dateRangeOverall: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "97%",
    alignItems: "center",
    alignSelf: "center",
  },
  buttonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    width: "25%",
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
    width: "100%",
  },
  fromDate: {
    width: "60%",
    height: 40,
    backgroundColor: "white",
  },
  toDateOverall: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
    width: "100%",
  },
  customCancelButtonOverall: {
    height: 30,
    width: 85,
    borderWidth: 1,
    justifyContent: "center",
    borderRadius: 5,
  },
  customeSetOverall: {
    height: 30,
    width: 85,
    backgroundColor: "#10680E",
    justifyContent: "center",
    borderRadius: 5,
  },
  customCancelButtonText: {
    color: "#10680E",
    alignItems: "center",
    textAlign: "center",
  },
  customSetButtonText: {
    color: "white",
    alignItems: "center",
    fontWeight: "bold",
    textAlign: "center",
  },
  dropdownContainer: {
    width: "60%", // Set container width to 200px
    alignSelf: "center", // Center horizontally
    marginVertical: 8, // 10px margin top & bottom
    backgroundColor: "#FFFFFF", // White background
    borderRadius: 10, // Rounded corners
    shadowColor: "#000", // Black shadow
    shadowOffset: { width: 0, height: 2 }, // Shadow direction
    shadowOpacity: 0.3, // Opacity for shadow
    shadowRadius: 6, // Blur effect
    elevation: 6, // Shadow for Android
    paddingHorizontal: 10, // Space inside the box
    paddingVertical: 2, // Space inside the box
  },
  picker: {
    width: "100%", // Match width to container
    color: "#000000", // Black text color
    backgroundColor: "#FFFFFF", // White background inside Picker
    borderRadius: 20, // Rounded corners
  },

  // -----

  progressContainer: {
    flexDirection: "row",
    width: "100%",
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: "20",
  },
  progressLeftContainer: {
    backgroundColor: "#3ECD7E",
    width: "50%",
    borderRadius: 20,
  },
  progressLeftView: {
    flex: 1,
    backgroundColor: "#3ECD7E",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  progressIcon: {
    marginVertical: 10,
  },

  progressHeader: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between", // Pushes text left and icon right
    alignItems: "center",
    marginBottom: 5, // Adds space before progress bar
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
  },
  progressCircleContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },

  progressCalorieText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -10 }],
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },

  //   right side bar
  progressRightView: {
    flex: 1,
  },
  rightProgressBarContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  rightProgressBarFirstView: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,

    borderRadius: 20,
    width: 180, // Adjust width
  },
  rightProgressBarProgressContainer: {
    marginRight: 10,
  },
  rightProgressBarTextContainer: {
    justifyContent: "center",
  },
  rightProgressBarProteinText: {
    fontSize: 18,
    color: "#0000000",
    // fontWeight: "bold",
  },
  rightProgressBarValueText: {
    fontSize: 16,
    color: "#7FD2A4", // Light green text for value
  },

  //   Water and sleep
  mainContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leftCard: {
    marginRight: 8,
  },
  rightCard: {
    marginLeft: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  waterText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  litresNumber: {
    fontSize: 22,
    fontWeight: "bold",
    marginRight: 5,
  },
  litresText: {
    fontSize: 16,
    color: "#777",
  },

  // Walk status

  walkStatusContainer: {
    position: "relative",
    padding: 15,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  removeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 100,
  },
  walkStatusSubView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    height: 40,
    marginLeft: 15,
    marginTop: 15,
  },
  walkStatusLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
  },
  walkStatusRightContainer: {
    width: "50%",
  },
  walkStatusIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#27f632",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  walkStatusText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  walkStatusProgress: {
    height: 6,
    borderRadius: 3,
  },

  // Workout
  workoutContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginTop: 15,
    padding: 20,
  },
  workoutHead: {
    flexDirection: "row",
    alignItems: "center",
  },
  workoutHeadText: {
    marginLeft: 15,
  },
  workoutView: {
    flexDirection: "column",
    alignItems: "center",
  },
  workoutIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  workoutText: {
    fontSize: 14,
    // fontWeight: "bold",
  },
});

export default Index;
