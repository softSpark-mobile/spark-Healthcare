import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

// const GOOGLE_MAPS_API_KEY = "";

const MapScreen = () => {
  const [isApiKeyValid, setIsApiKeyValid] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) :
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    flex: 1,
    width: "100%",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MapScreen;
