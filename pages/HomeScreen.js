import { StyleSheet, Text, View, ScrollView } from "react-native";
import Button from "../components/Button";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useSelector } from "react-redux";
import WorkoutSessionButton from "../components/WorkoutSessionButton";

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
    return (
      <Button
        key={index}
        background="#A3FD01"
        borderColor="none"
        textButton={element.name}
        textColor="black"
        width={300}
        height={50}
        onPress={() => handleWorkoutNavigation(element._id)}
        isLinearGradiant={true}
        colorsGradiant={["#3BC95F", "#1D632F"]}
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
        <Button
          background="#A3FD01"
          borderColor="none"
          textButton="Ajouter une séance"
          textColor="black"
          width={300}
          height={50}
          onPress={handleAddWorkout}
          isLinearGradiant={false}
        />
        <WorkoutSessionButton />
        {workoutsToShow}
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
    alignItems: "center",
    flex: 4,
  },
});
