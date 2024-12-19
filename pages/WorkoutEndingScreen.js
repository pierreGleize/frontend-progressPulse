import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Underline from "../components/Underline";
import Button from "../components/Button";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { addWorkout } from "../reducers/workoutsHistory";
import { resetCurrentWorkout } from "../reducers/currentWorkout";
import ConfettiCannon from "react-native-confetti-cannon";
import * as Haptics from "expo-haptics";

export default function WorkoutEndingScreen({ navigation, route }) {
  const { workoutID } = route.params;
  const dispatch = useDispatch();
  console.log(workoutID);

  useEffect(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }, []);

  const [personnalNote, setPersonnalNote] = useState(0);
  const [ressenti, setRessenti] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Récupération de la séance en cours d'enregistrement
  const currentWorkout = useSelector((state) => state.currentWorkout.value);

  const note = [];
  for (let star = 0; star < 5; star++) {
    let color = "#ffffff";
    let name = "star-o";
    if (star < personnalNote) {
      color = "#A3FD01";
      name = "star";
    }
    note.push(
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => setPersonnalNote(star + 1)}
        key={star}
      >
        <FontAwesome
          name={name}
          color={color}
          size={50}
          style={{ marginRight: 25 }}
        />
      </TouchableOpacity>
    );
  }

  const handlePress = () => {
    //currentWorkoutToAdd correspond à la valeur du reduceur currentWorkout
    let currentWorkoutToAdd = { ...currentWorkout };
    currentWorkoutToAdd.note = personnalNote;
    currentWorkoutToAdd.ressenti = ressenti;
    setIsLoading(true);
    fetch(`${process.env.EXPO_PUBLIC_SERVER_IP}/histories/addWorkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentWorkoutToAdd),
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch(addWorkout(data.workoutAdded));
        dispatch(resetCurrentWorkout());
        navigation.navigate("Home");
        setIsLoading(false);
      });
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <FontAwesome
            name={"chevron-left"}
            size={24}
            color={"#3BC95F"}
            style={{ marginBottom: 15 }}
            onPress={() =>
              navigation.navigate("startWorkout", { workoutID: workoutID })
            }
            accessibilityLabel="Redirection vers la liste des exercices"
          />
          <Text style={styles.title}>Séance terminée !</Text>
          <Underline width={80} />
        </View>
        <View style={styles.note}>
          <Text style={styles.text}>Comment s'est passsé ta séance ? </Text>
          <View style={styles.star}>{note}</View>
        </View>
        <View style={styles.bottomContainer}>
          <TextInput
            editable
            placeholder="Saisie ton ressenti sur la séance"
            multiline
            numberOfLines={10}
            maxLength={200}
            style={styles.input}
            onChangeText={(value) => setRessenti(value)}
            value={ressenti}
          />
          <Button
            textButton="Enregistrer ma séance"
            textColor="black"
            width="70%"
            height={50}
            background="#A3FD01"
            onPress={handlePress}
          />
        </View>
        {isLoading && (
          <View style={styles.backgroundLoading}>
            <ActivityIndicator size="large" color="#A3FD01" animating={true} />
          </View>
        )}
        <ConfettiCannon
          count={50}
          origin={{ x: 0, y: 0 }}
          autoStart={true}
          fadeOut={true}
          fallSpeed={2000}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D36",
  },

  topContainer: {
    marginTop: 50,
    marginLeft: 30,
    marginBottom: 20,
  },

  title: {
    fontSize: 24,
    color: "white",
    fontWeight: 600,
  },

  note: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
  },

  text: {
    color: "#FFFFFF",
    fontSize: 18,
  },

  star: {
    flexDirection: "row",
    marginTop: 30,
    marginLeft: 10,
  },

  input: {
    width: "70%",
    height: 400,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    margin: 10,
    textAlignVertical: "top",
  },

  bottomContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundLoading: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
});
