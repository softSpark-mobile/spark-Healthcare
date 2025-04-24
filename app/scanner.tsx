import { useState } from "react";
import { Text, View } from "react-native";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; // Required if you're using web

const Scanner = () => {
  const [value, setValue] = useState<string | undefined>();

  return (
    <View>
      <Text>Phone Number</Text>
      <PhoneInput
        placeholder="Enter phone number"
        value={value}
        onChange={setValue}
      />
    </View>
  );
};

export default Scanner;
