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

export default function HystoryScreen({ navigation }) {
  const history = useSelector((state) => state.workoutsHistory.value);

  const hystories = [...history]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map((element, i) => {
      const date = moment(element.date).format("Do MMM YYYY");

      let stars = [];
      for (let i = 0; i < element.note; i++) {
        stars.push(
          <FontAwesome key={i} name={"star"} size={15} color={"#3BC95F"} />
        );
      }

      const groupedWorkouts = element.performances.map((performance, i) => {
        const name = performance.exercise.name;
        return (
          <View key={i} style={{ width: "100%" }}>
            <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
              {name} :
            </Text>
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
              {performance.sets.map((set, i) => (
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
              ))}
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
        />
      );
    });

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity
          style={styles.backToContainer}
          onPress={() => navigation.navigate("Stats")}
        >
          <FontAwesome name={"chevron-left"} size={24} color={"#3BC95F"} />
          <Text style={styles.backToText}>Statisques</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Suivie de séance</Text>
      </View>
      <ScrollView style={styles.weightContainer}>
        {history.length === 0 ? (
          <View style={styles.infoContainer}>
            <FontAwesome
              name={"info-circle"}
              size={30}
              color={"#A3FD01"}
              style={styles.infoIcon}
            />
            <Text style={styles.textInfo}>
              Lancez une séance pour commencer votre suivi personnalisé !
            </Text>
          </View>
        ) : (
          hystories
        )}
      </ScrollView>
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
  nameTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: 600,
    textAlign: "center",
    marginBottom: 20,
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
