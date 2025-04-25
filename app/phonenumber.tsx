import React, { useRef, useState, useEffect } from "react";
import { View } from "react-native";
import PhoneInput from "react-native-phone-number-input";
import { getCountryCallingCode, getCountries } from "libphonenumber-js";

// Utility to map dial code to ISO country code
const getCountryFromDialCode = (dialCode: string): string => {
  const cleanCode = dialCode.replace("+", "");

  // Fix ambiguous dial codes manually if needed
  if (cleanCode === "1") return "US";
  if (cleanCode === "65") return "SG";
  if (cleanCode === "91") return "IN";

  const countries = getCountries();
  return (
    countries.find(
      (countryCode) => getCountryCallingCode(countryCode) === cleanCode
    ) || "US"
  );
};

const PhoneNumber = () => {
  const phoneInput = useRef<PhoneInput>(null);
  const [emergencyNumber, setEmergencyNumber] = useState("1234567");
  const [defaultCode, setDefaultCode] = useState<string | null>(null);

  // Simulated backend data — only country code
  const backendData = {
    countryCode: "+65", // You can change this to +91, +65, etc.
  };

  useEffect(() => {
    const code = getCountryFromDialCode(backendData.countryCode);
    setDefaultCode(code); // e.g., "US"
  }, []);

  if (!defaultCode) return null;

  return (
    <View style={{ marginTop: 40, paddingHorizontal: 20 }}>
      <PhoneInput
        ref={phoneInput}
        defaultValue={emergencyNumber}
        defaultCode={defaultCode as any}
        layout="first"
        onChangeFormattedText={(text) => setEmergencyNumber(text)}
        withShadow
        containerStyle={{
          borderRadius: 10,
          backgroundColor: "#f9f9f9",
        }}
        textContainerStyle={{
          borderRadius: 10,
          backgroundColor: "#f9f9f9",
        }}
      />
    </View>
  );
};

export default PhoneNumber;
