import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function WorkoutTypeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <FontAwesome
        name={"chevron-left"}
        size={30}
        color={"#3BC95F"}
        onPress={() => navigation.navigate("Home")}
      />
      <Text style={styles.text}>WorkoutType Screen</Text>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("muscleGroup")}
      >
        <Text style={styles.btnText}>Séance personalisée</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("WorkoutDifficulty")}
      >
        <Text style={styles.btnText}>Séance pré-définie</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "cyan",
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
