import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  Dimensions,
  FlatList,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import dayjs, { Dayjs } from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { ProgressBar } from "react-native-paper"; // Ensure you have react-native-paper installed

import Entypo from "@expo/vector-icons/Entypo";
import { AntDesign } from "@expo/vector-icons";

dayjs.extend(isoWeek);

const months: string[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const years: number[] = Array.from(
  { length: 20 },
  (_, i) => dayjs().year() - 10 + i
);

// Import images from assets
const foodImages = {
  oatmeal: require("@/assets/images/nuts.png"),
  eggs: require("@/assets/images/nuts.png"),
  apple: require("@/assets/images/nuts.png"),
  chicken: require("@/assets/images/nuts.png"),
  nuts: require("@/assets/images/nuts.png"),
  salmon: require("@/assets/images/nuts.png"),
};

const meals = [
  "Breakfast",
  "Morning Snacks",
  "Lunch",
  "Evening Snacks",
  "Dinner",
];

const foodData = {
  Breakfast: [
    {
      id: "1",
      name: "Oatmeal",
      calories: 150,
      fat: 2,
      protein: 5,
      carbs: 27,
      image: foodImages.oatmeal,
    },
    {
      id: "2",
      name: "Eggs",
      calories: 140,
      fat: 10,
      protein: 12,
      carbs: 1,
      image: foodImages.eggs,
    },
  ],
  "Morning Snacks": [
    {
      id: "3",
      name: "Apple",
      calories: 95,
      fat: 0.3,
      protein: 0.5,
      carbs: 25,
      image: foodImages.apple,
    },
  ],
  Lunch: [
    {
      id: "4",
      name: "Grilled Chicken",
      calories: 200,
      fat: 5,
      protein: 30,
      carbs: 2,
      image: foodImages.chicken,
    },
  ],
  "Evening Snacks": [
    {
      id: "5",
      name: "Nuts",
      calories: 180,
      fat: 15,
      protein: 5,
      carbs: 6,
      image: foodImages.nuts,
    },
  ],
  Dinner: [
    {
      id: "6",
      name: "Salmon",
      calories: 250,
      fat: 13,
      protein: 25,
      carbs: 0,
      image: foodImages.salmon,
    },
  ],
};

const ActivityScreen: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Dayjs>(
    dayjs().startOf("week")
  );
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = useState<number>(dayjs().month());
  const [selectedYear, setSelectedYear] = useState<number>(dayjs().year());
  // Input
  const [glucoseLevel, setGlucoseLevel] = useState<string>("");
  const [bloodPressure, setBloodPressure] = useState<string>("");

  // Refresh Button
  const [refreshCount, setRefreshCount] = useState<number>(); // Refresh button counter
  // Actual meal plan
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [actualMeal, setActualMeal] = useState<string | null>(null);
  const [foodInput, setFoodInput] = useState<string>("");
  // Food Suggestions
  const [selectedMeal, setSelectedMeal] = useState<string>("Breakfast");
  const [showFoodList, setShowFoodList] = useState<boolean>(false); // State to control food list visibility
  const totalCalories =
    foodData[selectedMeal]?.reduce((sum:number, food) => sum + food.calories, 0) || 0;

  const handleDonePress = (foodName: string) => {
    console.log(`${foodName} marked as done!`);
  };

  // Calender
  const getWeekDays = (startDate: Dayjs): Dayjs[] => {
    return Array.from({ length: 7 }, (_, i) =>
      startDate.startOf("week").add(i, "day")
    );
  };

  const handleDateSelection = (day: Dayjs) => {
    setSelectedDate(day);

    // Ensure currentDate updates and reflects correct month & year
    setCurrentDate(day);
    setSelectedMonth(day.month());
    setSelectedYear(day.year());
  };

  // Refresh
  const handleSearch = () => {
    setShowFoodList(true); // Show food list when search button is clicked
  };

  // Blood pressure Model
  const [bloodPressureModalVisible, setBloodPressureModalVisible] =
    useState(false);
  const [sys, setSys] = useState<number | null>(null);
  const [dia, setDia] = useState<number | null>(null);
  const handleSubmit = () => {
    console.log(`Meal: ${actualMeal}, Food: ${foodInput}`);
    // Handle form submission logic here
    setShowFoodList(true);
  };

  return (
    <View>
      <ScrollView>
        <View style={styles.container}>
          {/* Calander  */}
          <View>
            {/* Month-Year Selection */}
            <View style={styles.monthYearContainer}>
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={styles.monthHeaderButton}
              >
                <Text style={styles.monthText}>
                  {months[selectedMonth]} {selectedYear}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Calendar Content */}
            <View style={styles.contentContainer}>
              {/* Weekday Headers */}
              <View style={styles.weekHeader}>
                <View style={styles.weekDaysContainer}>
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day, index) => (
                      <Text key={index} style={styles.weekText}>
                        {day}
                      </Text>
                    )
                  )}
                </View>
              </View>

              {/* Date Selection */}
              <View style={styles.dateRow}>
                <TouchableOpacity
                  onPress={() => {
                    const newDate = currentDate.subtract(7, "day");
                    setCurrentDate(newDate);
                    setSelectedMonth(newDate.month());
                    setSelectedYear(newDate.year());
                  }}
                  style={styles.navButton}
                >
                  <Entypo
                    name="chevron-with-circle-left"
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>

                <View style={styles.weekDaysContainer}>
                  {getWeekDays(currentDate).map((day, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleDateSelection(day)}
                      style={[
                        styles.dateCircle,
                        selectedDate.isSame(day, "day") && styles.activeDate,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dateText,
                          selectedDate.isSame(day, "day") &&
                            styles.activeDateText,
                        ]}
                      >
                        {day.format("D")}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  onPress={() => {
                    const newDate = currentDate.add(7, "day");
                    setCurrentDate(newDate);
                    setSelectedMonth(newDate.month());
                    setSelectedYear(newDate.year());
                  }}
                  style={styles.navButton}
                >
                  <Entypo
                    name="chevron-with-circle-right"
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Month-Year Selection Modal */}
            <Modal visible={modalVisible} transparent animationType="slide">
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Select Month & Year</Text>

                  {/* Month Picker */}
                  <Picker
                    selectedValue={selectedMonth}
                    onValueChange={(itemValue) => setSelectedMonth(itemValue)}
                    style={styles.picker}
                  >
                    {months.map((month, index) => (
                      <Picker.Item key={index} label={month} value={index} />
                    ))}
                  </Picker>

                  {/* Year Picker */}
                  <Picker
                    selectedValue={selectedYear}
                    onValueChange={(itemValue) => setSelectedYear(itemValue)}
                    style={styles.picker}
                  >
                    {years.map((year) => (
                      <Picker.Item
                        key={year}
                        label={year.toString()}
                        value={year}
                      />
                    ))}
                  </Picker>

                  <TouchableOpacity
                    onPress={() => {
                      const newDate = dayjs()
                        .year(selectedYear)
                        .month(selectedMonth)
                        .startOf("month");
                      setCurrentDate(newDate);
                      setModalVisible(false);
                    }}
                    style={styles.doneButton}
                  >
                    <Text style={styles.buttonText}>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>

          {/* inputs */}
          <View style={styles.container}>
            {/* Glucose Level Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Glucose Level"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={glucoseLevel}
                  onChangeText={setGlucoseLevel}
                />
                <Text style={styles.unitText}>mg/dl</Text>
              </View>
            </View>

            {/* Blood Pressure Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Blood Pressure"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={bloodPressure}
                  onChangeText={setBloodPressure}
                />
                <Text style={styles.unitText}>mm/Hg</Text>
              </View>
            </View>

            {/* Refresh Again Button */}
            <View style={styles.refreshContainer}>
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={handleSearch}
              >
                <Text style={styles.refreshText}>Search</Text>
              </TouchableOpacity>
            </View>

            {/* Actual Food */}
            <View style={styles.actualFoodContainer}>
              {/* Subview: Header Section */}
              <View style={styles.headerContainer}>
                {/* Left Side - Actual Food Label */}
                <Text style={styles.actualFoodLabel}>Food In-taken:</Text>

                {/* Right Side - Plus Icon */}
                <TouchableOpacity
                  onPress={() => setShowDropdown(!showDropdown)}
                >
                  <AntDesign name="pluscircle" size={24} color="black" />
                </TouchableOpacity>
              </View>

              {/* Show Dropdown when Plus Icon is clicked */}
              {showDropdown && (
                <View style={styles.dropdownWrapper}>
                  <Picker
                    selectedValue={actualMeal}
                    onValueChange={(itemValue: string) =>
                      setActualMeal(itemValue)
                    }
                    style={styles.actualFoodPicker}
                  >
                    <Picker.Item label="Select Meal" value={null} />
                    <Picker.Item label="Breakfast" value="Breakfast" />
                    <Picker.Item
                      label="Morning Snacks"
                      value="Morning Snacks"
                    />
                    <Picker.Item label="Lunch" value="Lunch" />
                    <Picker.Item
                      label="Evening Snacks"
                      value="Evening Snacks"
                    />
                    <Picker.Item label="Dinner" value="Dinner" />
                  </Picker>
                </View>
              )}

              {/* Show Input Field when a meal is selected */}
              {actualMeal && actualMeal !== "Select Meal" && (
                <TextInput
                  style={styles.actualFoodInput}
                  placeholder={`Enter food for ${actualMeal}`}
                  value={foodInput}
                  onChangeText={(text: string) => setFoodInput(text)}
                />
              )}

              {/* Show Submit Button only when input is provided */}
              <View style={styles.submitContainer}>
                {actualMeal && foodInput.trim() !== "" && (
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.submitButtonText}>Submit</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Food List - Conditionally Rendered */}
            {showFoodList && (
              <View style={styles.foodSuggestcontainer}>
                {/* Meal Selection Header */}
                <View style={styles.foodMealHeader}>
                  <View style={styles.mealSelection}>
                    {meals.map((meal) => (
                      <TouchableOpacity
                        key={meal}
                        style={[
                          styles.mealButton,
                          selectedMeal === meal && styles.activeMeal,
                        ]}
                        onPress={() => setSelectedMeal(meal)}
                      >
                        <Text
                          style={[
                            styles.mealText,
                            selectedMeal === meal && { color: "black" },
                          ]}
                        >
                          {meal}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Total Calories */}
                <Text style={styles.totalCalories}>
                  Total Calories: {totalCalories} kcal
                </Text>

                {/* Food List */}
                <View>
                  {foodData[selectedMeal].map((item) => (
                    <View key={item.id} style={styles.foodItem}>
                      <Image source={item.image} style={styles.foodImage} />
                      <View style={styles.foodInfoContainer}>
                        <Text style={styles.foodName}>{item.name}</Text>
                        <Text>Calories: {item.calories} kcal</Text>
                        <Text>
                          Fat: {item.fat} g | Protein: {item.protein} g | Carbs:{" "}
                          {item.carbs} g
                        </Text>

                        {/* ✅ Done Button at Bottom of Card */}
                        <TouchableOpacity
                          style={styles.foodDoneButton}
                          onPress={() => handleDonePress(item.name)}
                        >
                          <Text style={styles.foodDoneButtonText}>Done</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  monthYearContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 10,
    paddingLeft: 20,
  },
  monthHeaderButton: {
    backgroundColor: "#00318D",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  monthText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  contentContainer: {
    paddingBottom: 0,
    padding: 65, // Padding for the rest of the content
    paddingTop: 10,
    alignItems: "center",
  },
  weekHeader: {
    marginBottom: 8,
  },
  weekDaysContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
  weekText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateCircle: {
    flex: 1,
    alignItems: "center",
    padding: 8,
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: "center",
  },
  activeDate: {
    backgroundColor: "#00318D",
  },
  dateText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  activeDateText: {
    color: "#fff",
    fontWeight: "bold",
  },
  navButton: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    minWidth: 40,
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  picker: {
    width: 200,
    height: 50,
  },
  doneButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#00318D",
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 10,
    height: 45,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "black",
  },
  unitText: {
    color: "#666",
    fontSize: 14,
    marginRight: 10,
  },
  refreshContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginRight: 20,
  },
  refreshButton: {
    backgroundColor: "#00318D",
    paddingVertical: 5,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  refreshText: {
    color: "#FFFFFF",
    fontWeight: "normal",
    fontSize: 16,
  },
  actualFoodContainer: {
    padding: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  actualFoodLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  dropdownWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 10,
  },
  actualFoodPicker: {
    height: 50,
    width: "100%",
  },
  actualFoodInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    width: "100%",
  },
  submitContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginRight: 20,
  },
  submitButton: {
    backgroundColor: "#00318D",
    paddingVertical: 5,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontWeight: "normal",
    fontSize: 16,
  },
  foodSuggestcontainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    marginTop: 10,
  },
  foodMealHeader: {
    width: "100%",
    backgroundColor: "#00318D",
    borderRadius: 50,
    padding: 1,
  },
  mealSelection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
  },
  mealButton: {
    padding: 2,
    width: 70,
    height: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  },
  activeMeal: { backgroundColor: "#FFFFFF", color: "#000" },
  mealText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  totalCalories: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  foodItem: {
    backgroundColor: "#F8F9FA",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    flexDirection: "row",
  },
  foodInfoContainer: {
    flex: 1,
    justifyContent: "space-between",
    paddingLeft: 10,
  },
  foodImage: { width: 50, height: 50, marginRight: 10, borderRadius: 25 },
  foodName: { fontSize: 16, fontWeight: "bold" },
  foodDoneButton: {
    backgroundColor: "#00318D",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    alignSelf: "flex-end",
  },
  foodDoneButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});

export default ActivityScreen;