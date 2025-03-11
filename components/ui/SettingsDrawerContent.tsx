import { View, Text, TouchableOpacity } from "react-native";

export default function SettingsDrawerContent() {
  return (
    <View style={{ padding: 20 }}>
      <TouchableOpacity >
        <Text>Profile Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity >
        <Text>Settings</Text>
      </TouchableOpacity>
      {/* Add more items as needed */}
    </View>
  );
}