import React from "react";
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { AntDesign } from "@expo/vector-icons"; // Import Vector Icon

const { height } = Dimensions.get("window");

const walkingScreen = () => {
  return (
    <View style={styles.container}>
      {/* Map View */}
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

      {/* Bottom Sheet (Always Visible) */}
      <View style={styles.bottomSheet}>
        {/* Set Target Button */}
        <TouchableOpacity style={styles.targetButton} onPress={() => console.log("Dropdown Pressed")}>
          <Text style={styles.targetText}>Set Target</Text>
          <AntDesign name="caretdown" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "70%", // Map takes 70% of the screen
  },
  bottomSheet: {
    width: "100%",
    height: height * 0.3, // 30% of the screen height
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    position: "absolute",
    bottom: 0,
  },
  targetButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  targetText: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
  icon: {
    marginTop: 2, // Adjust icon alignment
  },
});

export default walkingScreen;
