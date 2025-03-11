import { View } from "react-native";
import { Text, TextInput } from "react-native-paper";

const ActivityScreen = () => {
    return (  
        <View style={{backgroundColor:'blue',flex:1}}>
            <Text>
                Activity Screen
            </Text>
            <TextInput mode="outlined"/>

        </View>
    );
}
 
export default ActivityScreen;