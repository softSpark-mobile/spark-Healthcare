import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider, useSelector } from "react-redux";
import { RootState } from "@/components/Redux/store";
import { router, Stack } from "expo-router";
import { store } from "@/components/Redux/store";
import Auth from "@/components/Auth/Auth";
import SplashScreen from "@/components/SplashScreen";
import OnboardingScreen from "@/components/Onboarding/OnboardingScreen";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { PaperProvider } from "react-native-paper";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
export default function RootLayout() {
  return (
    <>
      <Provider store={store}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PaperProvider>
            <BottomSheetModalProvider>
              <MainApp />
            </BottomSheetModalProvider>
          </PaperProvider>
        </GestureHandlerRootView>
      </Provider>
    </>
  );
}

function MainApp() {
  const authss = useSelector((state: RootState) => state.auth);

  const [authState, setAuthState] = useState<boolean>(authss.isAuthenticated);

  // if (!authState) {
  //   console.log("-----");
  //   return <SplashScreen />;
  // } else {
  //   if (!authss.token) {
  //     return <Auth />;
  //   } else {
  //     if (authss.isOnboarding === false) {
  //       return <OnboardingScreen />;
  //     } else {
  return (
    // <>
    //   <OnboardingScreen />
    // </>
    <Stack>
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      {/* Walking Screen */}
      <Stack.Screen
        name="walkingScreen"
        options={{
          headerTitle: "Walking", // Set Header Title
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginEnd: 20 }}
            >
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="running" options={{ headerShown: false }} />
      <Stack.Screen name="cycling" options={{ headerShown: false }} />
      <Stack.Screen name="healthDashboard" options={{ headerShown: false }} />
      <Stack.Screen
        name="settings"
        options={{
          headerTitle: "Settings", // Set Header Title
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginEnd: 20 }}
            >
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="updatePersonal"
        options={{
          headerTitle: "Personal Information", // Set Header Title
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginEnd: 20 }}
            >
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="updateHealthData"
        options={{
          headerTitle: "Health Data", // Set Header Title
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginEnd: 20 }}
            >
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="updateHealthHistory"
        options={{
          headerTitle: "Health History", // Set Header Title
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginEnd: 20 }}
            >
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
//     }
//   }
// }
