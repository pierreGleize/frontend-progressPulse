import { StyleSheet, Text, View, ScrollView } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Underline from "../components/Underline";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import BtnWorkoutSession from "../components/BtnWorkoutSession";
import {
  addAllExercise,
  resetWorkoutCreation,
} from "../reducers/workoutCreation";
import imagesWorkout from "../utils/imagesWorkout";

export default function WorkoutChoiceScreen({ navigation, route }) {
  const { name } = route.params;
  const dispatch = useDispatch();

  const handleNavigateToSummary = (data) => {
    dispatch(resetWorkoutCreation());
    let exercisesToAdd = [];
    console.log(data);
    for (let exercise of data) {
      console.log(exercise.sets);
      let customSets = [];
      for (let set of exercise.sets) {
        customSets.push({
          weight: set.weight,
          reps: set.rep,
        });
      }
      exercisesToAdd.push({
        exercise: exercise.exercice._id,
        exerciseName: exercise.exercice.name,
        muscleGroup: exercise.exercice.muscleGroupe,
        rest: exercise.rest,
        customSets: customSets,
      });
    }
    dispatch(addAllExercise(exercisesToAdd));
    navigation.navigate("workoutSummary", {
      backTo: "workoutChoice",
      name: name,
    });
  };

  const [addWorkout, setAddWorkout] = useState([]);

  useEffect(() => {
    fetch(`${process.env.EXPO_PUBLIC_SERVER_IP}/workouts/byDifficulty/${name}`)
      .then((response) => response.json())
      .then((data) => {
        setAddWorkout(data.data);
      });
  }, []);
  // console.log(addWorkout);

  const nameWorkout = addWorkout.map((data, i) => {
    // console.log(data.image);
    const imageSource = imagesWorkout.filter((imageWorkout) => {
      // console.log(imageWorkout.name, element.image);
      if (imageWorkout.name === data.image) {
        return imageWorkout.source;
      }
    });
    const nbExercises = data.exercices.length + " exercices";
    let time = () => {
      for (let i = 0; i < data.exercices.length; i++) {
        let times = 0;
        //Pour chaque exercice : (nombre de série * temps de repos + nombre de série * 45s) / 60 pour l'avoir en minutes
        //Pour le temps complet : ((nombre de série * temps de repos + nombre de série * 45s) / 60) * nombre d'exercices dans le workout
        times =
          ((data.exercices[i].sets.length * data.exercices[i].rest +
            data.exercices[i].sets.length * 45) /
            60) *
          data.exercices.length;
        return Math.round(times);
      }
    };
    return (
      <BtnWorkoutSession
        key={i}
        name={data.name}
        time={time() + " min"}
        nbExercise={nbExercises}
        onPress={() => handleNavigateToSummary(data.exercices)}
        accessibilityLabel={`Choisir la séance ${data.name}`}
        accessibilityHint="Vous serez redirigé vers le résumé de cette séance"
        image={imageSource}
      />
    );
  });

  return (
    <View style={styles.container}>
      <View>
        <FontAwesome
          name={"chevron-left"}
          size={24}
          color={"#3BC95F"}
          accessibilityLabel="Redirection vers la page pour choisir la difficultée d'une séance"
          style={{ marginLeft: 15, marginTop: 5 }}
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
        <Text style={styles.textInfo}>Choisis ta séance !</Text>
      </View>
      <View style={styles.btnContainer}>
        <ScrollView contentContainerStyle={{ paddingBottom: 85 }}>
          {nameWorkout}
        </ScrollView>
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
    marginTop: 10,
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

  btnText: {
    fontSize: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    textAlign: "center",
    color: "white",
  },

  image: {
    width: "45%",
    height: "80%",
    resizeMode: "cover",
    borderRadius: 5,
    marginLeft: 10,
    marginTop: 10,
  },

  gradiant: {
    height: 120,
    width: "100%",
    maxWidth: 500,
    borderRadius: 20,
    justifyContent: "flex-start",
  },

  btn: {
    fontSize: 40,
    borderRadius: 10,
    backgroundColor: "#3BC95F",
    margin: 20,
    borderRadius: 20,
  },

  btnText: {
    fontSize: 30,
    fontWeight: 600,
    top: 40,
    right: 10,
    position: "absolute",
    color: "white",
    textAlign: "right",
  },

  btnContainer: {
    flex: 1,
    gap: 20,
    alignItems: "center",
    marginTop: 10,
  },
});
