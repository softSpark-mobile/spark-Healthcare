import React from "react";
import { View, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

interface FoodModalProps {
    visible: boolean;
    setVisible: (value: boolean) => void;
}

const FoodModal: React.FC<FoodModalProps> = ({ visible, setVisible }) => {
    return (
        <Modal transparent={true} visible={visible} animationType="fade" onRequestClose={() => setVisible(false)}>
            <Pressable 
                style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }} 
                onPress={() => setVisible(false)}
            >
                <View style={{ width: 300, backgroundColor: "white", padding: 20, borderRadius: 10 }}>
                    
                    {/* Meal Sections with "+" Icons */}
                    {["Breakfast", "Morning Snacks", "Lunch", "Evening Snacks", "Dinner"].map((meal, index) => (
                        <View 
                            key={index} 
                            style={{ 
                                flexDirection: "row", 
                                alignItems: "center", 
                                justifyContent: "space-between",
                                marginTop: 15,
                                paddingBottom: 10, 
                                borderBottomWidth: index < 4 ? 1 : 0, // Border except last item
                                borderBottomColor: "#ccc"
                            }}
                        >
                            <Text style={{ fontSize: 16, fontWeight: "bold" }}>{meal}</Text>
                            
                            {/* Plus Icon */}
                            <TouchableOpacity>
                                <Feather name="plus" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                    ))}

                    {/* Close Button */}
                    <TouchableOpacity 
                        onPress={() => setVisible(false)}
                        style={{ marginTop: 20, backgroundColor: "#007BFF", paddingVertical: 10, borderRadius: 10 }}
                    >
                        <Text style={{ textAlign: "center", color: "white", fontSize: 16 }}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Pressable>
        </Modal>
    );
};

export default FoodModal;
