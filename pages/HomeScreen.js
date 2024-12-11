import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Button from "../components/Button";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useSelector } from "react-redux";

export default function HomeScreen({ navigation }) {
  const user = useSelector((state) => state.user.value);
  const handleAddWorkout = () => {
    navigation.navigate("WorkoutType");
  };

  const handleWorkoutNavigation = (name) => {
    navigation.navigate("startWorkout", {
      headerTitle: name,
    });
  };

  const workouts = ["Ma séance préfaite", "Ma séance sur mesure"];
  const workout = workouts.map((element, index) => (
    <Button
      key={index}
      background="#A3FD01"
      borderColor="none"
      textButton={element}
      textColor="black"
      width={300}
      height={50}
      onPress={() => handleWorkoutNavigation(element)}
      isLinearGradiant={true}
      colorsGradiant={["#3BC95F", "#1D632F"]}
    />
  ));

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.title}>Hello {user.username},</Text>
        <Text style={styles.span}>prêt pour un nouvel entrainement ?</Text>
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
        {/* <Button
          background="#A3FD01"
          borderColor="none"
          textButton="Ma séance préfaite"
          textColor="black"
          width={300}
          height={50}
          onPress={() => handleWorkoutNavigation(textButton)}
          isLinearGradiant={true}
          colorsGradiant={["#3BC95F", "#1D632F"]}
        />
        <Button
          background="#A3FD01"
          borderColor="none"
          textButton="Ma séance sur mesure"
          textColor="black"
          width={300}
          height={50}
          onPress={() => handleWorkoutNavigation(textButton)}
          isLinearGradiant={true}
          colorsGradiant={["#3BC95F", "#1D632F"]}
        /> */}
        {workout}
        <Button
          background="#A3FD01"
          borderColor="none"
          textButton="exercice"
          textColor="black"
          width={300}
          height={50}
          onPress={() => navigation.navigate('exercice')}
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
    flex: 2,
  },
});
