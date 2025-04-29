import React from "react";
import { View, Text } from "react-native";

const StepBar = ({ current, total }) => (
  <View style={{ width: "90%", alignSelf: "center", marginTop: 30, marginBottom: 10 }}>
    <View style={{
      height: 9,
      backgroundColor: "#E2EEFF",
      borderRadius: 7,
      overflow: "hidden",
    }}>
      <View style={{
        height: "100%",
        width: `${((current + 1) / total) * 100}%`,
        backgroundColor: "#0057FF",
        borderRadius: 7,
      }} />
    </View>
    <Text style={{
      alignSelf: "center",
      fontWeight: "bold",
      color: "#0057FF",
      marginTop: 2,
      fontSize: 15,
      letterSpacing: 1
    }}>
      {`${current + 1} / ${total}`}
    </Text>
  </View>
);

export default StepBar;
