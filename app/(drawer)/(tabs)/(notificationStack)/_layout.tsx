import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name="notification"   options={{ headerShown:false }}/>
        </Stack>
    );
}