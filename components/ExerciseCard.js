import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useState } from "react";

const ExerciseCard = ({
  exerciseName,
  numberOfSets,
  numberOfReps,
  weight,
  restTime,
  //   isCompleted,
  isEditable,
  handleFinishExercice,
}) => {
  const [isCompleted, setIsCompleted] = useState(false);
  return (
    <View style={{ marginTop: 20, marginBottom: 10 }}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{exerciseName}</Text>
      </View>
      <LinearGradient
        colors={["#1C1C45", "#4645AB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.container}
      >
        <View style={styles.cardContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>
              {numberOfSets <= 1 ? "Nombre de série : " : "Nombre de séries : "}
              <Text style={styles.span}>{numberOfSets}</Text>
            </Text>
            <Text style={styles.text}>
              {numberOfReps <= 1
                ? "Nombre de répétition : "
                : "Nombre de répétitions : "}
              <Text style={styles.span}>{numberOfReps}</Text>
            </Text>
            <Text style={styles.text}>
              Charge : <Text style={styles.span}>{weight} kg</Text>
            </Text>
            <Text style={styles.text}>
              Temps de repos : <Text style={styles.span}>{restTime}</Text>
            </Text>
          </View>
          {isEditable ? (
            <View style={styles.iconContainer}>
              <FontAwesome name={"pencil"} size={20} color={"#3BC95F"} />
              <FontAwesome name={"trash"} size={20} color={"#3BC95F"} />
            </View>
          ) : (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setIsCompleted(!isCompleted)}
            >
              <FontAwesome
                name={isCompleted ? "check-circle" : "play-circle-o"}
                size={45}
                color={isCompleted ? "#A3FD01" : "white"}
                style={styles.iconStartWorkout}
              />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

export default ExerciseCard;

const styles = StyleSheet.create({
  container: {
    width: 340,
    height: 140,

    borderRadius: 10,
    overflow: "hidden",
    padding: 15,
    justifyContent: "space-around",
  },
  titleContainer: {
    backgroundColor: "#272D34",
    width: 280,
    borderRadius: 10,
    alignItems: "center",
    position: "absolute",
    top: -15,
    height: 25,
    justifyContent: "center",
    zIndex: 2,
    left: "8%",
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  textContainer: {
    justifyContent: "space-around",
  },
  text: {
    color: "white",
    fontSize: 16,
  },
  span: {
    fontWeight: "bold",
  },
  iconContainer: {
    justifyContent: "space-between",
  },
  iconStartWorkout: {
    position: "absolute",
    bottom: -10,
    right: -5,
  },
});
