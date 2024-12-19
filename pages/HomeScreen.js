import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import Button from "../components/Button";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useSelector } from "react-redux";
import BtnWorkoutSession from "../components/BtnWorkoutSession";
import Underline from "../components/Underline";
import imagesWorkout from "../utils/imagesWorkout";
export default function HomeScreen({ navigation }) {
  const user = useSelector((state) => state.user.value);
  const workouts = useSelector((state) => state.workouts.value);
  const handleAddWorkout = () => {
    navigation.navigate("WorkoutType");
  };
  const handleWorkoutNavigation = (workoutID) => {
    navigation.navigate("startWorkout", {
      workoutID: workoutID,
    });
  };

  const workoutsToShow = workouts.map((element, index) => {

    const imageSource = imagesWorkout.filter((imageWorkout) => {
      if (imageWorkout.name === element.image) {
        return imageWorkout.source;
      }
    });

    //nombre d'exercices dans le workout 
    let nbExercises = "";
    if (element.exercises.length === 1) {
      nbExercises = element.exercises.length + " exercice";
    } else {
      nbExercises = element.exercises.length + " exercices";
    }

    //durée du workout
    let time = () => {
      for (let i = 0; i < element.exercises.length; i++) {
        let times = 0;
        //Pour chaque exercice : (nombre de série * temps de repos + nombre de série * 45s) / 60 pour l'avoir en minutes
        //Pour le temps complet : ((nombre de série * temps de repos + nombre de série * 45s) / 60) * nombre d'exercices dans le workout
        times =
          ((element.exercises[i].customSets.length * element.exercises[i].rest +
            element.exercises[i].customSets.length * 45) /
            60) *
          element.exercises.length;
        return Math.round(times);
      }
    };
    
    return (
      <BtnWorkoutSession
        key={index}
        name={element.name}
        nbExercise={nbExercises}
        time={time() + " min"}
        onPress={() => handleWorkoutNavigation(element._id)}
        accessibilityLabel={`Commencer la séance ${element.name}`}
        image={imageSource}
      />
    );
  });

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.title}>Hello {user.username},</Text>
        <Text style={styles.span}>prêt pour un nouvel entrainement ?</Text>
        {workouts.length === 0 && (
          <View style={styles.infoContainer}>
            <FontAwesome
              name={"info-circle"}
              size={30}
              color={"#A3FD01"}
              style={styles.infoIcon}
            />
            <Text style={styles.textInfo}>
              Crée ta séance et commence l'entrainement
            </Text>
          </View>
        )}
      </View>

      <View style={styles.btnContainer}>
        <View style={styles.btn}>
          <Button
            background="#A3FD01"
            borderColor="none"
            textButton="Ajouter une séance"
            textColor="black"
            width={300}
            height={50}
            onPress={handleAddWorkout}
            isLinearGradiant={false}
            accessibilityLabel="Ajouter une séance d'entrainement"
          />
        </View>
        {workouts.length === 0 && (
          <View style={styles.image}>
            <Image
              style={styles.image}
              source={require("../assets/illustrations/homePage.png")}
            />
          </View>
        )}
        {workouts.length > 0 && (
          <View style={styles.seances}>
            <Text style={styles.text}>Mes séances :</Text>
            <Underline width={50} />
          </View>
        )}
        <View style={styles.btn}>
          <ScrollView contentContainerStyle={{ paddingBottom: 85 }}>
            {workoutsToShow}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D36",
    paddingVertical: 50,
    paddingHorizontal: 20,
    justifyContent: "center",
  },

  topContainer: {
    flex: 1,
  },

  title: {
    fontSize: 40,
    fontWeight: 600,
    color: "white",
  },

  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },

  span: {
    color: "#A3FD01",
  },

  infoIcon: {
    marginRight: 10,
  },

  textInfo: {
    color: "white",
  },

  btnContainer: {
    flex: 4,
  },

  btn: {
    alignItems: "center",
    justifyContent: "space-between",
  },

  text: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  seances: {
    marginHorizontal: 15,
    marginBottom: 15,
  },

  image: {
    margin: "auto",
    marginTop: 30,
    width: 350,
    height: 350,
  },
});
