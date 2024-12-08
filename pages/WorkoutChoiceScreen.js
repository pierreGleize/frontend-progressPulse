import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function WorkoutChoiceScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <FontAwesome
        name={"chevron-left"}
        size={30}
        color={"#3BC95F"}
        onPress={() =>
          navigation.navigate("WorkoutDifficulty", { backTo: "workoutChoice" })
        }
      />
      <Text style={styles.text}>WorkoutChoice Screen</Text>
      <TouchableOpacity
        style={styles.btn}
        onPress={() =>
          navigation.navigate("workoutSummary", { backTo: "workoutChoice" })
        }
      >
        <Text style={styles.btnText}>Full-body</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btn}
        onPress={() =>
          navigation.navigate("workoutSummary", { backTo: "workoutChoice" })
        }
      >
        <Text style={styles.btnText}>Haut du corps</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btn}
        onPress={() =>
          navigation.navigate("workoutSummary", { backTo: "workoutChoice" })
        }
      >
        <Text style={styles.btnText}>Bas du corps</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rebeccapurple",
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
    backgroundColor: "#3BC95F",
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
