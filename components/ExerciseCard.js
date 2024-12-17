import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeExercise } from "../reducers/workoutCreation";
import { useEffect } from "react";

const ExerciseCard = ({
  exerciseName,
  muscleGroup,
  numberOfSets,
  numberOfReps,
  weight,
  restMinutes,
  restSeconds,
  isEditable = true,
  exerciseID,
  openModalCustomSets,
  handleDelete,
  startExercise
}) => {

  const dispatch = useDispatch()

  // Récupération de la séance en cours
  const currentWorkout = useSelector(state => state.currentWorkout.value)
  const currentExercise = currentWorkout.performances.find(e => e.exercise === exerciseID)


  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (currentExercise){
      if (currentExercise.sets.length >= numberOfSets){
        setIsCompleted(true)
      } else {
        setIsCompleted(false)
      }
    } else {
      setIsCompleted(false)
    }
  },[currentExercise])

  const handleUpdate = () => {
    openModalCustomSets(exerciseName, exerciseID, weight, numberOfReps, numberOfSets, restMinutes, restSeconds, muscleGroup)
  }

  const handlePress = () => {
    if (isEditable === false){
      if(!isCompleted)
      startExercise(exerciseID)
    }
  }


  return (
    <TouchableOpacity
              activeOpacity={1}
              onPress={handlePress}
            >
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
            { muscleGroup != "Cardio" && <>
            <Text style={styles.text}>
              {numberOfSets <= 1 ? "Nombre de série : " : "Nombre de séries : "}
              <Text style={styles.span}>{numberOfSets}</Text>
            </Text>
            <Text style={styles.text}>
              {numberOfReps <= 1
                ? "Nombre de répétition : "
                : "Nombre de répétitions : "}
              <Text style={styles.span}>{numberOfReps} </Text>
            </Text>
            </>}
            <Text style={styles.text}>
              {muscleGroup === "Cardio" ? "Resistance/Inclinaison:" : "Charge : "} <Text style={styles.span}>{weight} {muscleGroup != "Cardio" && "kg"}</Text>
            </Text>
            <Text style={styles.text}>
              {muscleGroup === "Cardio" ? "Durée :" : "Temps de repos : "} <Text style={styles.span}>{restMinutes} {muscleGroup != "Cardio" ? "min" : "h"} {restSeconds} {muscleGroup != "Cardio" ? "sec" : "min"}</Text>
            </Text>
          </View>
          {isEditable ? (
            <View style={styles.iconContainer}>
              <FontAwesome name={"pencil"} size={20} color={"#3BC95F"} onPress={handleUpdate}/>
              <FontAwesome name={"trash"} size={20} color={"#3BC95F"} onPress={() => handleDelete(exerciseID)}/>
            </View>
          ) : (

              <FontAwesome
                name={isCompleted ? "check-circle" : "play-circle-o"}
                size={45}
                color={isCompleted ? "#A3FD01" : "white"}
                style={styles.iconStartWorkout}
              />
            
          )}
        </View>
      </LinearGradient>
    </View>
    </TouchableOpacity>
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
