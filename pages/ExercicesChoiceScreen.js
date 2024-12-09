import { StyleSheet, Text, View, ScrollView } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import ExerciseBtn from "../components/ExerciseBtn";
import Button from "../components/Button";
// import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Underline from "../components/Underline";

export default function ExercicesChoicesScreen({ navigation, route }) {
  const { name } = route.params;

  const handleFinish = () => {
    navigation.navigate("workoutSummary", { backTo: "exercicesChoices" });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <FontAwesome
          name={"chevron-left"}
          size={30}
          color={"#3BC95F"}
          onPress={() => navigation.navigate("muscleGroup")}
        />
        <View style={{ marginVertical: 20 }}>
          <Text style={styles.title}>{name}</Text>
          <Underline width={40} />
        </View>
      </View>
      <View style={styles.btnContainer}>
        <ScrollView
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <ExerciseBtn
            textButton="Tirage hozizontale à la poulie"
            image={require("../assets/rowing.png")}
          />
          <ExerciseBtn
            textButton="Traction"
            image={require("../assets/rowing.png")}
          />
          <ExerciseBtn
            textButton="Tirage hozizontale à la poulie"
            image={require("../assets/rowing.png")}
          />
          <ExerciseBtn
            textButton="Tirage hozizontale à la poulie"
            image={require("../assets/rowing.png")}
          />
          <ExerciseBtn
            textButton="Tirage hozizontale à la poulie"
            image={require("../assets/rowing.png")}
          />
          <ExerciseBtn
            textButton="Tirage hozizontale à la poulie"
            image={require("../assets/rowing.png")}
          />
          <ExerciseBtn
            textButton="Tirage hozizontale à la poulie"
            image={require("../assets/rowing.png")}
          />
          <ExerciseBtn
            textButton="Tirage hozizontale à la poulie"
            image={require("../assets/rowing.png")}
          />
        </ScrollView>
      </View>

      <View style={styles.bottomContainer}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D36",
    paddingVertical: 50,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 32,
    color: "white",
    fontWeight: 600,
  },
  topContainer: {
    flex: 1,
    justifyContent: "space-between",
    marginBottom: 20,
  },
  btnContainer: {
    flex: 5,
  },
  bottomContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});
