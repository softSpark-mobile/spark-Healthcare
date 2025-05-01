import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, Image } from "react-native";
import DrawerList from "@/components/DrawerList";
import { View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useState } from "react";
import { BackendUrl } from "@/constants/backendUrl";
import { useSelector } from "react-redux";
import { RootState } from "@/components/Redux/store";
import axios from "axios";

export default function Layout() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const userData = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useFocusEffect(()=>{
    fetchProfileImage();
  })

  const fetchProfileImage = async () => {
    try {
      const response = await axios.get(
        `${BackendUrl}/api/user/getUserByUserId/${userData.userId}`,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      
      // Assuming the API returns profilePhoto field with the image path
      if (response.data.data?.profilePhoto) {
        setProfileImage(`${BackendUrl}/${response.data.data.profilePhoto}`);
      }
      console.log(profileImage,'ppppppppppppp');
      
    } catch (error) {
      console.error("Error fetching profile image:", error);
    }
  };
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
                    source={
                      profileImage
                        ? { uri: profileImage }
                        : require("@/assets/images/profile.png")
                    }
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
