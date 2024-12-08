import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Button from "../components/Button";
import ExerciseBtn from "../components/ExerciseBtn";

export default function HomeScreen({ navigation }) {
  const handleAddWorkout = () => {
    navigation.navigate("WorkoutType");
  };

  const handleWorkoutNavigation = () => {
    navigation.navigate("workoutSummary", { backTo: "Home" });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home Screen</Text>
      <Button
        background="#A3FD01"
        borderColor="none"
        textButton="Ajouter une séance"
        textColor="black"
        width="75%"
        height={50}
        onPress={handleAddWorkout}
        isLinearGradiant={false}
      />
      <Button
        background="#A3FD01"
        borderColor="none"
        textButton="Ma séance préfaite"
        textColor="black"
        width="75%"
        height={50}
        onPress={handleWorkoutNavigation}
        isLinearGradiant={true}
        colorsGradiant={["#3BC95F", "#1D632F"]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D36",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 50,
    padding: 50,
    textAlign: "center",
    color: "white",
  },
});
