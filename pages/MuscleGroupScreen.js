import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function MuscleGroupScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <FontAwesome
        name={"chevron-left"}
        size={30}
        color={"#3BC95F"}
        onPress={() => navigation.navigate("WorkoutType")}
      />
      <Text style={styles.text}>MuscleGroup Screen</Text>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("exercicesChoices")}
      >
        <Text style={styles.btnText}>Biceps</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("exercicesChoices")}
      >
        <Text style={styles.btnText}>Cardio</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("exercicesChoices")}
      >
        <Text style={styles.btnText}>Triceps</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("exercicesChoices")}
      >
        <Text style={styles.btnText}>Abdominaux</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ backgroundColor: "green", padding: 15 }}
        onPress={() =>
          navigation.navigate("workoutSummary", { backTo: "muscleGroup" })
        }
      >
        <Text style={styles.btnText}>Terminer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "wheat",
    alignItems: "center",
    justifyContent: "center",
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
    backgroundColor: "black",
    margin: 10,
  },
  btnText: {
    fontSize: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    textAlign: "center",
    color: "white",
  },
});
