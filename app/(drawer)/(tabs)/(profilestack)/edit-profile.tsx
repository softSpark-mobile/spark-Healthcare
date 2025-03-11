import { router } from "expo-router";
import { View } from "react-native";
import { Avatar, Button, Text, TextInput } from "react-native-paper";

const EditProfile = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "yellow" }}>
      <View
        style={{
          alignSelf: "center",
          justifyContent: "center",
          padding: 20,
          gap: 10,
        }}
      >
        <Avatar.Text label="i" />
        <Text
          style={{
            textAlign: "center",
            color: "black",
            fontSize: 18,
            fontWeight: "700",
          }}
        >
          {" "}
          John{" "}
        </Text>
      </View>
            <TextInput placeholder="Enter your name "  mode="outlined" style={{width:'90%',alignSelf:'center',margin:10}} />
            <TextInput placeholder="Age"  mode="outlined" style={{width:'90%',alignSelf:'center',margin:10}} />
            <TextInput placeholder="Gender"  mode="outlined" style={{width:'90%',alignSelf:'center',margin:10}} />

      <Button
        onPress={() => router.back()}
        mode="contained"
        style={{ width: "50%", alignSelf: "center" }}
      >
        Go Back
      </Button>
    </View>
  );
};

export default EditProfile;
