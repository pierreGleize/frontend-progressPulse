import React from "react";
import { StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const BtnMuscleGroup = ({ name, source, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.btn}
      onPress={() => onPress(name)}
    >
      <LinearGradient
        colors={["#3BC95F", "#1f532c"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradiant}
      >
        <Text style={styles.btnText}>{name}</Text>
        <Image source={source} style={styles.image} />
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    margin: 10,
  },
  btnText: {
    fontSize: 20,
    fontWeight: 600,
    bottom: 5,
    left: 5,
    position: "absolute",
    color: "white",
    zIndex: 2,
  },

  image: {
    width: "50%",
    height: "100%",
    resizeMode: "cover",
    marginRight: 5,
  },

  gradiant: {
    height: 70,
    width: 170,
    borderRadius: 10,
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
  },
});

export default BtnMuscleGroup;
