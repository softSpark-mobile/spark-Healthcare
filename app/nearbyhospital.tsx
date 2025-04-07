import { useState, useEffect, useRef } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Image } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import { googleApiKey } from "@/components/data/apiKey";
import BottomSheet from "@gorhom/bottom-sheet";

const GOOGLE_API_KEY = googleApiKey;

export default function NearbyHospital() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHospital, setSelectedHospital] = useState<any | null>(null);
  const [directions, setDirections] = useState<any[]>([]);
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      fetchNearbyHospitals(currentLocation.coords.latitude, currentLocation.coords.longitude);
    })();
  }, []);

  const fetchNearbyHospitals = async (lat: number, lng: number) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=hospital&key=${GOOGLE_API_KEY}`
      );
      setHospitals(response.data.results);
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHospitalDetails = async (hospital: any) => {
    setSelectedHospital(hospital);
    bottomSheetRef.current?.expand();

    if (location) {
      fetchRoute(
        location.coords.latitude,
        location.coords.longitude,
        hospital.geometry.location.lat,
        hospital.geometry.location.lng
      );
    }
  };

  const fetchRoute = async (startLat: number, startLng: number, endLat: number, endLng: number) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startLat},${startLng}&destination=${endLat},${endLng}&key=${GOOGLE_API_KEY}`
      );
      setDirections(response.data.routes[0]?.overview_polyline?.points || []);
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading nearby hospitals...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {/* User's location */}
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="You are here"
            pinColor="blue"
          />

          {/* Hospital Markers */}
          {hospitals.map((hospital, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: hospital.geometry.location.lat,
                longitude: hospital.geometry.location.lng,
              }}
              title={hospital.name}
              description={hospital.vicinity}
              onPress={() => fetchHospitalDetails(hospital)}
            />
          ))}

          {/* Route Polyline */}
          {directions.length > 0 && (
            <Polyline
              coordinates={decodePolyline(directions)}
              strokeWidth={4}
              strokeColor="red"
            />
          )}
        </MapView>
      ) : (
        <Text style={styles.errorText}>Unable to get location.</Text>
      )}

      {/* Bottom Sheet for Hospital Details */}
      <BottomSheet ref={bottomSheetRef} index={-1} snapPoints={["25%", "50%"]}>
        {selectedHospital && (
          <View style={styles.bottomSheetContent}>
            <Text style={styles.hospitalName}>{selectedHospital.name}</Text>
            <Image
              source={{ uri: selectedHospital.photos ? getPhotoUrl(selectedHospital.photos[0].photo_reference) : "https://via.placeholder.com/150" }}
              style={styles.hospitalImage}
            />
            <Text style={styles.hospitalInfo}>📍 {selectedHospital.vicinity}</Text>
            <Text style={styles.hospitalInfo}>📞 {selectedHospital.formatted_phone_number || "No contact info"}</Text>
          </View>
        )}
      </BottomSheet>
    </View>
  );
}

// Function to decode Google Polyline
const decodePolyline = (encoded: string) => {
  let points = [];
  let index = 0, len = encoded.length;
  let lat = 0, lng = 0;

  while (index < len) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlat = (result & 1) ? ~(result >> 1) : (result >> 1);
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlng = (result & 1) ? ~(result >> 1) : (result >> 1);
    lng += dlng;

    points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }
  return points;
};

// Get Photo URL from Google API
const getPhotoUrl = (photoReference: string) =>
  `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${GOOGLE_API_KEY}`;

// Styles
const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { textAlign: "center", marginTop: 20, fontSize: 16, color: "red" },
  bottomSheetContent: { padding: 20 },
  hospitalName: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  hospitalImage: { width: "100%", height: 150, borderRadius: 10, marginBottom: 10 },
  hospitalInfo: { fontSize: 16, marginBottom: 5 },
});
