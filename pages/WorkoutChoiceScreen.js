import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Underline from "../components/Underline";
import Button from "../components/Button";

export default function WorkoutChoiceScreen({ navigation, route }) {
  const { categorie } = route.params;

  const handleWorkoutNavigation = () => {
    navigation.navigate("workoutSummary", {
      backTo: "workoutChoice",
      categorie: categorie,
    });
  };
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <FontAwesome
          name={"chevron-left"}
          size={24}
          color={"#3BC95F"}
          style={{ marginLeft: 15, marginTop: 5 }}
          onPress={() => navigation.navigate("WorkoutDifficulty")}
        />
        <View>
          <Text style={styles.title}>{categorie}</Text>
          <Underline width={80} />
        </View>
        <View style={styles.infoContainer}>
          <FontAwesome
            name={"info-circle"}
            size={30}
            color={"#A3FD01"}
            style={styles.infoIcon}
          />
          <Text style={styles.textInfo}>Choisie ta séance</Text>
        </View>
      </View>
      <View style={styles.btnContainer}>
        <Button
          background="#A3FD01"
          borderColor="none"
          textButton="Full body"
          textColor="black"
          width={300}
          height={50}
          onPress={handleWorkoutNavigation}
          isLinearGradiant={true}
          colorsGradiant={["#3BC95F", "#1D632F"]}
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
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 32,
    color: "white",
    fontWeight: 600,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    marginRight: 10,
  },
  textInfo: {
    color: "white",
  },
  btnContainer: {
    flex: 3,
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "pink",
  },
});
