import { StyleSheet, Text, View, FlatList } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Button from "../components/Button";
import Underline from "../components/Underline";

export default function MuscleGroupScreen({ navigation }) {
  const handleFinish = () => {
    navigation.navigate("workoutSummary", { backTo: "muscleGroup" });
  };
  const handleNavigateToExercice = (name) => {
    navigation.navigate("exercicesChoices", { name: name });
  };
  const muscularGroup = [
    "Quadriceps",
    "Ischio",
    "Biceps",
    "Triceps",
    "Épaules",
    "Fessiers",
    "Pectoraux",
    "Dos",
    "Abdominaux",
    "Cardio",
  ];
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <FontAwesome
          name={"chevron-left"}
          size={30}
          color={"#3BC95F"}
          onPress={() => navigation.navigate("WorkoutType")}
        />
        <View>
          <Text style={styles.title}>Exercices </Text>
          <Underline width={60} />
        </View>
      </View>

      <View style={styles.btnContainer}>
        <FlatList
          data={muscularGroup}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
          }}
          columnWrapperStyle={{
            justifyContent: "space-around",
            alignItems: "center",
          }}
          renderItem={({ item }) => (
            <Button
              background="#A3FD01"
              borderColor="none"
              textButton={item}
              textColor="white"
              width={150}
              height={50}
              onPress={() => handleNavigateToExercice(item)}
              isLinearGradiant={true}
              colorsGradiant={["#3BC95F", "#1D632F"]}
            />
          )}
        />
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.bottomText}>
          Exercices sélectionnés : <Text style={styles.bottomSpan}>0</Text>
        </Text>
        <View style={styles.bottomBtnContainer}>
          <Button
            background="#A3FD01"
            borderColor="none"
            textButton="Terminer"
            textColor="black"
            width={150}
            height={50}
            onPress={handleFinish}
            isLinearGradiant={false}
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