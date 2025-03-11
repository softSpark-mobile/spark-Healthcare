import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, Image } from "react-native";
import DrawerList from "@/components/DrawerList";
import { View } from "react-native";
import { useRouter } from "expo-router";

export default function Layout() {
  const router = useRouter();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerTitle: "Health Care",
          headerTitleAlign: "center",
          drawerStyle: {
            width: "70%", // Adjust this value to decrease the drawer width
          },
          headerRight: () => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 15,
              }}
            >
              {/* Settings Icon */}
              <TouchableOpacity
                onPress={() => router.push("/settings")}
                style={{ marginRight: 10 }}
              >
                <Ionicons name="settings-outline" size={24} color="black" />
              </TouchableOpacity>

              {/* Small Profile Picture */}
              <TouchableOpacity onPress={()=> router.push('/(drawer)/(tabs)/(profilestack)/profile')}>
                <Image
                  source={require("@/assets/images/profile.png")}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    borderWidth: 1,
                    borderColor: "#ccc",
                  }}
                />
              </TouchableOpacity>
            </View>
          ),
        }}
        drawerContent={() => <DrawerList />}
      />
    </GestureHandlerRootView>
  );
}
