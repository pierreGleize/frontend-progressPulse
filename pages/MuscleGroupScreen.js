import { StyleSheet, Text, View, FlatList } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Button from "../components/Button";
import Underline from "../components/Underline";
import { useSelector } from "react-redux";
import BtnMuscleGroup from "../components/BtnMuscleGroup";
import muscleGroupIcons from "../utils/muscleGroupIcons";

export default function MuscleGroupScreen({ navigation, route }) {

  const { isWorkoutAlreadyCreated = false, workoutID = null } = route.params || {};

  let exercisesLength = 0
  if (!isWorkoutAlreadyCreated){
    exercisesLength = useSelector(
      (state) => state.workoutCreation.value.exercises.length
    );  
  } else {
    const workouts = useSelector((state) => state.workouts.value)
    const workoutSelected = workouts.find(e => e._id === workoutID)
    exercisesLength = workoutSelected.exercises.length
  }
  

  const handleFinish = () => {
    if(!isWorkoutAlreadyCreated){
      navigation.navigate("workoutSummary", { backTo: "muscleGroup" });
    } else {
      navigation.navigate("startWorkout", {
        workoutID: workoutID,
      });
    }
    
  };

  const handleNavigateToExercice = (name) => {
    navigation.navigate("exercicesChoices", { name: name, isWorkoutAlreadyCreated, workoutID });
  };
  
  return (
    <View style={styles.container}>
      {!isWorkoutAlreadyCreated && <View style={styles.topContainer}>
        <FontAwesome
          name={"chevron-left"}
          size={24}
          color={"#3BC95F"}
          accessibilityLabel="Redirection pour choisir le type de séance"
          onPress={() => navigation.navigate("WorkoutType")}
          style={{ marginLeft: 15, marginTop: 5 }}
        />
        <View>
          <Text style={styles.title}>Exercices </Text>
          <Underline width={60} />
        </View>
      </View>}

      <View style={styles.btnContainer}>
        <FlatList
          data={muscleGroupIcons}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
          }}
          columnWrapperStyle={{
            justifyContent: "center",
            alignItems: "center",
          }}
          renderItem={({ item }) => (
            <BtnMuscleGroup
              name={item.name}
              source={item.source}
              onPress={() => handleNavigateToExercice(item.name)}
              accessibilityLabel={`Choisir le groupe ${item.name}`}
              accessibilityHint={"On va être rediriger vers la liste des exercices correspondant au groupe musculaire choisi"}
            />
          )}
        />
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.bottomText}>
          Exercices sélectionnés :{" "}
          <Text style={styles.bottomSpan}>{exercisesLength}</Text>
        </Text>
        <View style={styles.bottomBtnContainer}>
          <Button
            background="#A3FD01"
            borderColor="none"
            textButton={isWorkoutAlreadyCreated ? "Retourner à ma séance":"Voir le récap"}
            textColor="black"
            width={isWorkoutAlreadyCreated ? 280 : 150}
            height={50}
            onPress={handleFinish}
            isLinearGradiant={false}
            accessibilityLabel={"Voir le récapitulatif des exercices"}
            accessibilityHint={"Cette action vous redirigera vers la page affichant tous les exercices sélectionnés et vous permettra de valider la séance."}
          />
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
    paddingHorizontal: 10,
  },
  topContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 32,
    color: "white",
    fontWeight: 600,
  },
  btnContainer: {
    flex: 4,
  },
  bottomContainer: {
    flex: 1,
  },
  bottomText: {
    color: "white",
    fontSize: 16,
    marginBottom: 20,
  },
  bottomSpan: {
    fontWeight: "bold",
  },
  bottomBtnContainer: {
    alignItems: "center",
  },
});
