import React from "react";
import { StyleSheet, Text, TouchableOpacity, Image, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { FontAwesome5 } from "@expo/vector-icons";

export default function WorkoutSessionButton() {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={{
        marginBottom: 20,
      }}
    >
      <LinearGradient
        colors={["#3BC95F", "#1f532c"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradiant}
      >
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={require("../assets/illustrations/testbtnworkout.jpg")}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>Full Body Workout</Text>
          <View style={styles.iconWrapper}>
            <View style={styles.iconContainer}>
              <FontAwesome
                name={"clock-o"}
                size={17}
                color={"white"}
                style={{ opacity: 0.6 }}
              />
              <Text style={styles.text}>45 min</Text>
            </View>
            <View style={styles.iconContainer}>
              <FontAwesome5
                name={"dumbbell"}
                size={15}
                color={"white"}
                style={{ opacity: 0.6 }}
              />
              <Text style={styles.text}>10 exercices</Text>
            </View>
          </View>
          <View style={styles.btnContainer}>
            <Text style={styles.btnText}>Start workout</Text>
            <FontAwesome
              name={"long-arrow-right"}
              size={20}
              color={"#1D632F"}
            />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  gradiant: {
    borderRadius: 15,
    width: 350,
    maxWidth: 500,
    height: 130,
    flexDirection: "row",
    alignItems: "center",
  },
  imageContainer: {
    marginLeft: 10,
  },
  image: {
    width: 90,
    height: 90,
    resizeMode: "cover",
    borderRadius: 15,
  },
  textContainer: {
    marginLeft: 20,
    justifyContent: "space-around",
  },
  title: {
    fontSize: 18,
    color: "white",
    fontWeight: 600,
  },
  text: {
    color: "white",
    opacity: 0.6,
  },
  iconWrapper: {
    flexDirection: "row",
    marginVertical: 10,
  },
  iconContainer: {
    flexDirection: "row",
    gap: 5,
    marginRight: 5,
    alignItems: "center",
  },
  btnContainer: {
    padding: 6,
    width: 130,
    backgroundColor: "white",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  btnText: {
    color: "#1D632F",
    fontWeight: 600,
  },
});
