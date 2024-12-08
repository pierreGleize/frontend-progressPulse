import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import ExerciseBtn from "../components/ExerciseBtn";
import Button from "../components/Button";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Underline from "../components/Underline";

export default function ExercicesChoicesScreen({ navigation }) {
  const handleWorkoutNavigation = () => {
    navigation.navigate("workoutSummary", { backTo: "exercicesChoices" });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <FontAwesome
          name={"chevron-left"}
          size={30}
          color={"#3BC95F"}
          onPress={() => navigation.navigate("muscleGroup")}
        />
        <View style={{ marginVertical: 20 }}>
          <Text style={styles.text}>Dos</Text>
          <Underline width={40} />
        </View>
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
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            // marginTop: 20,
          }}
        >
          <Button
            background="#A3FD01"
            borderColor="none"
            textButton="Terminer"
            textColor="black"
            width="40%"
            height={50}
            onPress={handleWorkoutNavigation}
            isLinearGradiant={false}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D36",
    padding: 20,
  },
  text: {
    fontSize: 32,
    color: "white",
    fontWeight: 600,
  },
});
