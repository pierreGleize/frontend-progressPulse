import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const Button = ({
  textButton,
  textColor,
  width,
  height,
  background,
  borderWidth,
  borderColor,
  onPress,
  isLinearGradiant,
  colorsGradiant = null,
  accessibilityLabel,
  accessibilityHint,
}) => {
  if (isLinearGradiant) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        style={{
          width: width,
        }}
      >
        <LinearGradient
          colors={[colorsGradiant[0], colorsGradiant[1]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            height: height,
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              color: textColor,
              fontSize: 22,
              fontWeight: 400,
            }}
          >
            {textButton}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        accessibilityLabel={accessibilityLabel}
        style={{
          backgroundColor: background,
          width: width,
          height: height,
          borderWidth: borderWidth,
          borderColor: borderColor,
          borderRadius: 10,
          justifyContent: "center",
          alignItems: "center",
          margin: 20,
        }}
      >
        <Text
          style={{
            color: textColor,
            fontSize: 20,
            fontWeight: 400,
          }}
        >
          {textButton}
        </Text>
      </TouchableOpacity>
    );
  }
  r;
};

export default Button;

const styles = StyleSheet.create({});
