import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const HealthDashboard = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Spark Health</Text>
        <Ionicons name="settings-outline" size={24} />
      </View>

      {/* Meal & Glucose Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>🍽️ Breakfast</Text>
        <TouchableOpacity style={styles.addButton}><Text>+</Text></TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>🍎 Food</Text>
        <Text style={styles.inputBox}>Enter Glucose Level</Text>
      </View>

      {/* Calorie Progress */}
      <View style={styles.calorieBox}>
        <Text style={styles.calorieText}>Calories</Text>
        <Text style={styles.calorieValue}>640 Kcal</Text>
      </View>

      {/* Macronutrients */}
      <View style={styles.macroContainer}>
        <Text style={styles.proteinText}>🔴 Protein: 200g</Text>
        <Text style={styles.fatsText}>⚪ Fats: 88g</Text>
        <Text style={styles.carbsText}>🟢 Carbs: 280g</Text>
      </View>

      {/* Water & Sleep */}
      <View style={styles.trackerContainer}>
        <View style={styles.trackerBox}>
          <Text>💧 Water</Text>
          <Text style={styles.trackerValue}>2.1 Liters</Text>
        </View>
        <View style={styles.trackerBox}>
          <Text>🌙 Sleep</Text>
          <Text style={styles.trackerValue}>7.40 Hours</Text>
        </View>
      </View>

      {/* Running Stats */}
      <View style={styles.runningBox}>
        <Text style={styles.runningTitle}>🏃‍♂️ 0.10 km Running</Text>
        <Text>🔥 300 kcal • ⏳ 5 mins • 👣 468 steps</Text>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Ionicons name="grid-outline" size={24} />
        <Ionicons name="walk-outline" size={24} />
        <Ionicons name="stats-chart-outline" size={24} />
        <Ionicons name="person-outline" size={24} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  inputContainer: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 8,
  },
  inputBox: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 8,
  },
  calorieBox: {
    backgroundColor: "#34d399",
    padding: 20,
    borderRadius: 8,
    marginBottom: 16,
  },
  calorieText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  calorieValue: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
  macroContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  proteinText: {
    color: "red",
  },
  fatsText: {
    color: "gray",
  },
  carbsText: {
    color: "green",
  },
  trackerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  trackerBox: {
    backgroundColor: "#f0f0f0",
    padding: 16,
    borderRadius: 8,
    width: "48%",
  },
  trackerValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  runningBox: {
    backgroundColor: "#bfdbfe",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  runningTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
});

export default HealthDashboard;
