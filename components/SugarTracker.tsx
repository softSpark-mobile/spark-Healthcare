// import React, { useState } from "react";
// import { View, Text, FlatList, TouchableOpacity } from "react-native";
// import { PieChart } from "react-native-gifted-charts";
// import DateTimePicker from "@react-native-community/datetimepicker";

import { Text, View } from "react-native";

// const SugarTracker = () => {
//   const [selectedDate, setSelectedDate] = useState(new Date());
  
//   const generateRandomSugar = () => Math.floor(Math.random() * 30) + 5;
  
//   const getSugarLevel = (sugar) => {
//     if (sugar < 10) return "Normal";
//     if (sugar < 20) return "High";
//     return "Very High";
//   };

//   const sugarData = ["Breakfast", "Lunch", "Dinner"].map((meal) => {
//     const sugar = generateRandomSugar();
//     return {
//       meal,
//       sugar,
//       level: getSugarLevel(sugar),
//     };
//   });

//   const getColor = (level) => {
//     switch (level) {
//       case "Normal": return "#4CAF50"; // Green
//       case "High": return "#FF9800"; // Orange
//       case "Very High": return "#F44336"; // Red
//       default: return "#000";
//     }
//   };

//   const pieData = sugarData.map((item) => ({
//     value: item.sugar,
//     color: getColor(item.level),
//     text: item.meal,
//   }));

//   return (
//     <View style={{ flex: 1, padding: 20 }}>
//       {/* Date Picker */}
//       <TouchableOpacity onPress={() => setSelectedDate(new Date())}>
//         <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
//           {selectedDate.toDateString()}
//         </Text>
//       </TouchableOpacity>

//       {/* Sugar Intake List */}
//       <FlatList
//         data={sugarData}
//         keyExtractor={(item) => item.meal}
//         renderItem={({ item }) => (
//           <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 10, marginBottom: 5, backgroundColor: "#f0f0f0", borderRadius: 8 }}>
//             <Text style={{ fontSize: 16 }}>{item.meal}</Text>
//             <Text style={{ fontSize: 16, fontWeight: "bold", color: getColor(item.level) }}>
//               {item.sugar}g ({item.level})
//             </Text>
//           </View>
//         )}
//       />

//       {/* Sugar Pie Chart */}
//       <PieChart
//         data={pieData}
//         donut
//         radius={100}
//         innerRadius={50}
//         centerLabelComponent={() => (
//           <Text style={{ fontSize: 18, fontWeight: "bold" }}>Sugar Intake</Text>
//         )}
//       />
//     </View>
//   );
// };

// export default SugarTracker;
const SugarTracker = () => {
    return (<View>
        <Text>SSS</Text>
    </View>  );
}
 
export default SugarTracker;