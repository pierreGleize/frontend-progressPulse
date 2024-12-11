import {
  StyleSheet,
  View,
  ScrollView,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Button from "../components/Button";
import ExerciseCard from "../components/ExerciseCard";
import { useSelector } from "react-redux";

export default function WorkoutSummaryScreen({ navigation, route }) {
  const { backTo, categorie = {} } = route.params || {};
  console.log(backTo);

  const workout = useSelector(state => state.workoutCreation.value)

  const card = workout.exercises.map((data, i) => {
    console.log(data)
/*     return (
     <ExerciseCard key={i}
            exerciseName={data.exerciceName}
            numberOfSets={data}
            numberOfReps={data}
            weight={data}
            restTime={data.rest}
          />
    ) */
  })

  return (
    <View style={styles.container}>
      <View>
        <FontAwesome
          name={"chevron-left"}
          size={24}
          color={"#3BC95F"}
          style={{ marginLeft: 15, marginTop: 5 }}
          onPress={() => navigation.navigate(backTo, { categorie: categorie })}
        />
      </View>
      <View style={styles.mainContainer}>
        <ScrollView>
          {card}
        </ScrollView>
      </View>

      <View style={styles.bottomContainer}>
        <Button
          background="#A3FD01"
          borderColor="none"
          textButton={"Valider ma séance"}
          textColor="black"
          width={300}
          height={50}
          onPress={() => navigation.navigate("Home")}
          isLinearGradiant={false}
        />
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
  bottomContainer: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center",
  },
  mainContainer: {
    flex: 4,
    justifyContent: "center",
    alignItems: "center",
  },
});
