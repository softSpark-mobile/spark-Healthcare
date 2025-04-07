import { Text, View } from "react-native";
import {CountryButton, CountryPicker} from "react-native-country-codes-picker";

export function ListHeaderComponent({countries, lang, onPress}) {
    return (
        <View
            style={{
                // paddingBottom: 20,
                margin:20,
                paddingTop:50,
                backgroundColor:'red'
            }}
        >
            <Text>
                Popular countries
            </Text>
            {countries?.map((country, index) => {
                return (
                    <CountryButton key={index} item={country} name={country?.name?.[lang || 'en']} onPress={() => onPress(country)} />
                )
            })}
        </View>
    )
}