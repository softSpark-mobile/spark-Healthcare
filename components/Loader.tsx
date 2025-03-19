import * as React from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

const Loader = () => (
  <View style={styles.container}>
    <ActivityIndicator animating={true} color="#ED303C" size="large" />
  </View>
);
const styles = StyleSheet.create({container: { flex: 1,justifyContent:'center',alignItems:'center'}});
export default Loader;
