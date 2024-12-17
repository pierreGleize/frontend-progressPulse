import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeExercise } from "../reducers/workoutCreation";
import { Image } from "expo-image";

const ExerciseBtn = ({
  exerciseID,
  textButton,
  image,
  openModal,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const dispatch = useDispatch();

  const [isAdded, setIsAdded] = useState(false);

  const workoutCreationExercises = useSelector(
    (state) => state.workoutCreation.value.exercises
  );

  useEffect(() => {
    const exerciseAlreadyAdded = workoutCreationExercises.some(
      (exercise) => exercise.exercise === exerciseID
    );
    setIsAdded(exerciseAlreadyAdded);
  }, [workoutCreationExercises]);

  const handlePress = () => {
    if (!isAdded) {
      openModal(textButton, exerciseID);
    } else {
      dispatch(removeExercise(exerciseID));
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      onPress={handlePress}
      style={styles.container}
    >
      <LinearGradient
        colors={["#3BC95F", "#1f532c"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradiant}
      >
        <Image source={image} style={styles.picture} />
        <Text
          style={{
            color: "white",
            fontSize: 16,
            fontWeight: 600,
            width: "65%",
          }}
        >
          {textButton}
        </Text>
        <FontAwesome
          name={isAdded ? "check-circle" : "plus-circle"}
          size={35}
          color={isAdded ? "#A3FD01" : "white"}
        />
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default ExerciseBtn;

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    marginBottom: 25,
  },
  gradiant: {
    height: 70,
    borderRadius: 10,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    // borderColor: "red",
    padding: 10,
  },
  picture: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
});
