import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Underline from "../components/Underline";
import Button from "../components/Button";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addAllExercise, resetWorkoutCreation } from "../reducers/workoutCreation";


export default function WorkoutChoiceScreen({ navigation, route }) {

  const dispatch = useDispatch()
  const {name} = route.params
  const handleNavigateToSummary = (data) => {
    dispatch(resetWorkoutCreation())
    let exercisesToAdd = []
    for (let exercise of data){
      console.log(exercise.sets)
      let customSets = []
      for (let set of exercise.sets){
        customSets.push({
          weight: set.weight,
          reps: set.rep
        })
      }
      exercisesToAdd.push({
      exercise : exercise.exercice._id,
      exerciseName :exercise.exercice.name,
      muscleGroup: exercise.exercice.muscleGroupe,
      rest : exercise.rest,
      customSets : customSets
      })
    }
    dispatch(addAllExercise(exercisesToAdd))
    navigation.navigate('workoutSummary', {backTo :'workoutChoice'})
  }

  const [addWorkout, setAddWorkout] = useState([])

  useEffect(() => {
    fetch(`${process.env.EXPO_PUBLIC_SERVER_IP}/workouts/byDifficulty/${name}`)
      .then(response => response.json())
      .then(data => {
        setAddWorkout(data.data)
      })
  }, [])

  const nameWorkout = addWorkout.map((data, i) => {
    console.log(data.exercices)
    return (
      <Button key={i}
        background="#A3FD01"
        borderColor="none"
        textButton={data.name}
        textColor="white"
        width={350}
        height={60}
        onPress={() => handleNavigateToSummary(data.exercices)}
        isLinearGradiant={true}
        colorsGradiant={["#3BC95F", "#1D632F"]}
      />
    )
  })

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <FontAwesome
          name={"chevron-left"}
          size={30}
          color={"#3BC95F"}
          onPress={() => navigation.navigate("WorkoutDifficulty")}
        />
        <Text style={styles.title}>{name}</Text>
        <Underline width={80} />
      </View>
      <View style={styles.infoContainer}>
        <FontAwesome
          name={"info-circle"}
          size={30}
          color={"#A3FD01"}
          style={styles.infoIcon}
        />
        <Text style={styles.textInfo}>
          Choisis ta séance !
        </Text>
      </View>
      <View style={styles.btn}>
        {nameWorkout}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D36",
    paddingVertical: 50,
    paddingHorizontal: 10,
  },

  title: {
    marginTop: 20,
    fontSize: 28,
    color: "white",
    fontWeight: 600,
  },

  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10
  },

  infoIcon: {
    marginRight: 10,
  },

  textInfo: {
    color: "white",
  },

  text: {
    fontSize: 50,
    padding: 50,
    textAlign: "center",
    color: "white",
  },
  btn: {
    fontSize: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  btnText: {
    fontSize: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    textAlign: "center",
    color: "white",
  },
});
