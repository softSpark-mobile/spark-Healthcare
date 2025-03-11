import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import MapView from "react-native-maps";

const GOOGLE_API_KEY = "AIzaSyBt8mIln6PJamQuNyQq9VqytIrOY8aMqP4"; // Replace with your API key

const running = () => {
  const [isValidKey, setIsValidKey] = useState<boolean | null>(null);

  useEffect(() => {
    const validateApiKey = async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=New+York&key=${GOOGLE_API_KEY}`
        );
        const data = await response.json();
        
        if (data.status === "OK") {
          setIsValidKey(true);
        } else {
          setIsValidKey(false);
        }
      } catch (error) {
        setIsValidKey(false);
      }
    };

    validateApiKey();
  }, []);

  if (isValidKey === null) {
    return <ActivityIndicator size="large" color="blue" />;
  }

  return (
    <View style={{ flex: 1 }}>
      {isValidKey ? (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 37.7749,
            longitude: -122.4194,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 18, color: "red" }}>
            Invalid API Key. Please check your Google API Key.
          </Text>
        </View>
      )}
    </View>
  );
};

export default running;
