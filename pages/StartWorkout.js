import { StyleSheet, Text, View, ScrollView } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Button from "../components/Button";
import ExerciseCard from "../components/ExerciseCard";
import { useState } from "react";

export default function WorkoutSummaryScreen({ navigation, route }) {
  const { headerTitle } = route.params || {};
  const [isEditable, setIsEditable] = useState(true);
  //   const [isCompleted, setIsCompleted] = useState(false);

  //   const handleFinishExercice = () => {
  //     setIsCompleted(!isCompleted);
  //   };
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <FontAwesome
          name={"chevron-left"}
          size={24}
          color={"#3BC95F"}
          onPress={() => navigation.navigate("Home")}
        />
        <Text style={styles.topTitle}>{headerTitle}</Text>
        <FontAwesome name="trash" size={24} color={"#A3FD01"} />
      </View>

      <View style={styles.mainContainer}>
        <ScrollView>
          <ExerciseCard
            exerciseName="Squat"
            numberOfSets={4}
            numberOfReps={12}
            weight={80}
            restTime={120}
            isEditable={isEditable}
            // handleFinishExercice={handleFinishExercice}
            // isCompleted={isCompleted}
          />
          <ExerciseCard
            exerciseName="Bench"
            numberOfSets={1}
            numberOfReps={1}
            weight={80}
            restTime={120}
            isEditable={isEditable}
            // handleFinishExercice={handleFinishExercice}
            // isCompleted={isCompleted}
          />
          <ExerciseCard
            exerciseName="Bench"
            numberOfSets={1}
            numberOfReps={1}
            weight={80}
            restTime={120}
            isEditable={isEditable}
            // handleFinishExercice={handleFinishExercice}
            // isCompleted={isCompleted}
          />
          <ExerciseCard
            exerciseName="Bench"
            numberOfSets={1}
            numberOfReps={1}
            weight={80}
            restTime={120}
            isEditable={isEditable}
            // handleFinishExercice={handleFinishExercice}
            // isCompleted={isCompleted}
          />
          <ExerciseCard
            exerciseName="Bench"
            numberOfSets={1}
            numberOfReps={1}
            weight={80}
            restTime={120}
            isEditable={isEditable}
            // handleFinishExercice={handleFinishExercice}
            // isCompleted={isCompleted}
          />
        </ScrollView>
      </View>
      <View style={styles.bottomContainer}>
        <Button
          background="#A3FD01"
          borderColor="none"
          textButton={isEditable ? "Commencer la séance" : "Terminer la séance"}
          textColor="black"
          width={300}
          height={50}
          onPress={() => setIsEditable(!isEditable)}
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
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: "white",
    marginBottom: 30,
  },
  topTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: 600,
  },
  mainContainer: {
    flex: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
