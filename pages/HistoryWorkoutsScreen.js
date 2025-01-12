import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import HystoryWorkouts from "../components/HystoryWorkout";
import { useSelector } from "react-redux";
import moment from "moment";
import Underline from "../components/Underline";
import { LinearGradient } from "expo-linear-gradient";

export default function HistoryWorkoutsScreen({ navigation, route }) {
  const { workoutName } = route.params;
  const history = useSelector((state) => state.workoutsHistory.value);

  const filetredWorkout = history.filter((element) => {
    if (workoutName === "Toutes les séances") {
      return element;
    } else {
      return element.workoutName === workoutName;
    }
  });
  console.log(filetredWorkout);

  const hystories = filetredWorkout
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map((element, i) => {
      const date = moment(element.date).format("Do MMM YYYY");

      let stars = [];
      for (let i = 0; i < element.note; i++) {
        stars.push(
          <FontAwesome
            key={i}
            name={"star"}
            size={15}
            color={"#3BC95F"}
            //  accessibilityLabel="Affiche des étoiles correspondant à la note de notre séance"
          />
        );
      }

      const groupedWorkouts = element.performances.map((performance, i) => {
        const muscleGroupe = performance.exercise.muscleGroupe;
        const name = performance.exercise.name;
        return (
          <View key={i} style={{ width: "100%" }}>
            <Text style={{ color: "white", fontSize: 16 }}>{name} :</Text>
            <Underline width={40} />
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                flexWrap: "wrap",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              {performance.sets.map((set, i) => {
                const setHours = Math.floor(set.rest / 3600);
                const setMinutes = Math.floor(set.rest % 3600) / 60;
                const durée =
                  setHours > 0
                    ? `Durée : ${setHours}h ${setMinutes}min - Résistance : ${set.weight}`
                    : `Durée : ${setMinutes}min - Résistance : ${set.weight}`;
                return muscleGroupe !== "Cardio" ? (
                  <LinearGradient
                    key={i}
                    colors={["#1C1C45", "#4645AB"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      height: 23,
                      width: "45%",
                      marginBottom: 10,
                      marginRight: 10,
                      borderRadius: 10,
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ color: "#ffffff", textAlign: "center" }}>
                      Série {i + 1} : {set.reps} x {set.weight} kg
                    </Text>
                  </LinearGradient>
                ) : (
                  <LinearGradient
                    key={i}
                    colors={["#1C1C45", "#4645AB"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      height: 23,
                      width: "75%",
                      marginBottom: 10,
                      marginRight: 10,
                      borderRadius: 10,
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ color: "#ffffff", textAlign: "center" }}>
                      {durée}
                    </Text>
                  </LinearGradient>
                );
              })}
            </View>
          </View>
        );
      });

      return (
        <HystoryWorkouts
          key={i}
          name={element.workoutName}
          date={date}
          stars={stars}
          ressenti={element.ressenti}
          workouts={groupedWorkouts}
          accessibilityLabel={`Affiche les détails de notre séance`}
        />
      );
    });

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity
          style={styles.backToContainer}
          onPress={() => navigation.navigate("history")}
          accessibilityLabel="Retour sur la page history"
          accessibilityHint="On va retourner sur la page suivie de séance"
        >
          <FontAwesome name={"chevron-left"} size={24} color={"#3BC95F"} />
          <Text style={styles.backToText}>Suivi</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>{workoutName}</Text>
      </View>
      <ScrollView style={styles.weightContainer}>{hystories}</ScrollView>
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
  topContainer: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: "white",
    marginBottom: 25,
  },
  backToContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    left: 0,
    bottom: 10,
  },
  backToText: {
    color: "#3BC95F",
    marginLeft: 8,
  },
  topTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: 600,
  },
  weightContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 15,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  infoIcon: {
    marginRight: 10,
  },
  textInfo: {
    color: "white",
  },
});
