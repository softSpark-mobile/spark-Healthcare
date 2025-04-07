import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { PieChart, pieDataItem } from "react-native-gifted-charts";
import { Text } from "react-native-paper";
import * as Progress from "react-native-progress";
import moment from "moment";

/** Extend pieDataItem to include kcal */
type CustomPieDataItem = pieDataItem & { kcal: number };

const CaloriePieChart: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  /** Updated Data Structure */
  const calorieData: CustomPieDataItem[] = [
    { value: 600, color: "#FF6B6B", text: "Breakfast", kcal: 600 },
    { value: 800, color: "#FFD93D", text: "Lunch", kcal: 800 },
    { value: 500, color: "#6BCB77", text: "Dinner", kcal: 500 },
    { value: 200, color: "#4D96FF", text: "Snacks", kcal: 200 },
  ];

  const totalCalories = calorieData.reduce((sum, item) => sum + item.kcal, 0);
  const dailyCalorieLimit = 2500;

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Centered Title */}
        <Text style={styles.title}>Calorie Tracker</Text>

        {/* Centered Date Picker */}
        <View style={styles.dateWrapper}>
          <Pressable onPress={() => setDatePickerVisibility(true)} style={styles.dateContainer}>
            <Text style={styles.dateText}>{moment(selectedDate).format("MMM D, YYYY")}</Text>
          </Pressable>
        </View>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={(date) => {
            setSelectedDate(date);
            setDatePickerVisibility(false);
          }}
          onCancel={() => setDatePickerVisibility(false)}
        />

        {/* Pie Chart and Legend */}
        <View style={styles.chartWrapper}>
          {/* Pie Chart */}
          <View style={styles.chartContainer}>
            <PieChart
              data={calorieData}
              radius={120}
              innerRadius={60}
              donut
              showText
              textColor="white"
              textSize={12}
            />
          </View>

          {/* Legend on the Right */}
          <View style={styles.legendContainer}>
            {calorieData.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <Text style={styles.legendText}>{item.text}: {item.kcal} Kcal</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Individual Calorie Progress */}
        <View style={styles.progressContainer}>
          {calorieData.map((item, index) => (
            <View key={index} style={styles.progressItem}>
              <Text style={styles.progressLabel}>{item.text}</Text>
              <Progress.Bar
                progress={item.kcal / dailyCalorieLimit}
                width={220}
                color={item.color}
                borderColor="white"
                height={8}
                borderRadius={5}
              />
            </View>
          ))}
        </View>

        {/* Total Calories Progress */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>Total: {totalCalories} / {dailyCalorieLimit} kcal</Text>
          <Progress.Bar
            progress={totalCalories / dailyCalorieLimit}
            width={250}
            color={"#FFD93D"}
            borderColor="white"
            height={10}
            borderRadius={5}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default CaloriePieChart;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#34448B",
    height: "100%",
    width: "100%",
    alignItems: "center",
    padding: 10,
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center", // Centered title
    paddingBottom: 10,
  },
  dateWrapper: {
    alignItems: "center", // Centered Date Picker
    marginBottom: 10,
  },
  dateContainer: {
    backgroundColor: "lightblue",
    padding: 8,
    borderRadius: 6,
  },
  dateText: {
    color: "#232B5D",
    fontSize: 14,
    fontWeight: "bold",
  },
  chartWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  chartContainer: {
    padding: 10,
    borderRadius: 15,
    backgroundColor: "#232B5D",
    alignItems: "center",
  },
  legendContainer: {
    marginLeft: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  legendDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    color: "white",
    fontSize: 12,
  },
  progressContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  progressItem: {
    marginBottom: 10,
    alignItems: "center",
  },
  progressLabel: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  summaryContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  summaryText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
});
