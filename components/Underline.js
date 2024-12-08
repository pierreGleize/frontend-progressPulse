import React from "react";
import { View } from "react-native";

export default function Underline({ width }) {
  return (
    <View
      style={{
        borderBottomColor: "#A3FD01",
        borderBottomWidth: 2,
        marginVertical: 5,
        width: width,
      }}
    ></View>
  );
}
