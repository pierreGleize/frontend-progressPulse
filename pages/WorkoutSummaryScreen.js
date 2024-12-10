import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useEffect, useState } from "react";

export default function WorkoutSummaryScreen({ navigation, route }) {
  const {name, backTo} = route.params;
  const [workout, setWorkout] = useState([])

  useEffect(() => {
    fetch (`${process.env.EXPO_PUBLIC_SERVER_IP}/workouts/byName/${name}`)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      setWorkout(data.data)
    })
  }, [])

/*   const workout = workout.map((data,i) => {
    return (

    )
  }) */
  return (
    <View style={styles.container}>
      <FontAwesome
        name={"chevron-left"}
        size={30}
        color={"#3BC95F"}
        onPress={() => navigation.navigate('workoutChoice')}
      />

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.btnText}>
          {backTo === "Home" ? "Commencer ma séance" : "Valider ma séance"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "brown",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 40,
    padding: 50,
    textAlign: "center",
    color: "white",
  },
  btn: {
    fontSize: 40,
    borderRadius: 10,
    backgroundColor: "black",
  },
  btnText: {
    fontSize: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    textAlign: "center",
    color: "white",
  },
  cards: {
    width: 300,
    height: 100,
    backgroundColor: "#4645AB",
    margin: 10,
    alignItems: "center",
  },
  cardsTitle: {
    color: "white",
    margin: -10,
  },
});
