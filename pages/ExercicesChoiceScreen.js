import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import ExerciseBtn from "../components/ExerciseBtn";
import Button from "../components/Button";
import Underline from "../components/Underline";
import { useEffect, useState } from "react";
import images from "../utils/images";
import { useDispatch, useSelector } from "react-redux";
import { addExercise } from "../reducers/workoutCreation";
import { updateExercises } from "../reducers/workouts";

export default function ExercicesChoicesScreen({ navigation, route }) {
  const { name, isWorkoutAlreadyCreated, workoutID } = route.params;
  const dispatch = useDispatch();
  const value = useSelector((state) => state.workoutCreation.value);

  const [exercisesList, setExercisesList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [exerciseID, setExerciseID] = useState("");
  const [exerciseName, setExerciseName] = useState("");
  const [charge, setCharge] = useState("");
  const [nbSets, setNbSets] = useState("");
  const [nbReps, setNbReps] = useState("");
  const [restMinutes, setRestMinutes] = useState("1");
  const [restSeconds, setRestSeconds] = useState("00");
  const [emptyFields, setEmptyFields] = useState(false);
  const [isCardio, setIsCardio] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (name === "Cardio") {
      setIsCardio(true);
    } else {
      setIsCardio(false);
    }
    setIsLoading(true);
    fetch(`${process.env.EXPO_PUBLIC_SERVER_IP}/exercises/${name}`)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setExercisesList(data.data);
          setIsLoading(false);
        }
      });
  }, []);

  const handleFinish = () => {
    navigation.navigate("muscleGroup", { workoutID, isWorkoutAlreadyCreated });
  };

  const openModal = (textButton, exerciseID) => {
    setModalVisible(!modalVisible);
    setExerciseName(textButton);
    setExerciseID(exerciseID);
  };

  const closeModal = () => {
    setCharge("");
    setExerciseID("");
    setExerciseName("");
    setNbReps("");
    setNbSets("");
    setRestMinutes("1");
    setRestSeconds("00");
    setModalVisible(false);
  };

  const addToWorkout = () => {
    if (!isCardio) {
      if (!charge || !nbReps || !nbSets || !restMinutes || !restSeconds) {
        setEmptyFields(true);
      } else {
        setEmptyFields(false);
        let customSets = [];
        for (let i = 0; i < parseInt(nbSets); i++) {
          customSets.push({ weight: parseInt(charge), reps: parseInt(nbReps) });
        }
        const restConverted =
          parseInt(restMinutes) * 60 + parseInt(restSeconds);
        const exerciseToAdd = {
          exercise: exerciseID,
          exerciseName: exerciseName,
          muscleGroup: name,
          rest: restConverted,
          customSets: customSets,
        };
        dispatch(addExercise(exerciseToAdd));
        closeModal();
      }
    } else {
      if (!charge || !restMinutes || !restSeconds) {
        setEmptyFields(true);
      } else {
        setEmptyFields(false);
        const customSets = [{ weight: parseInt(charge), reps: 1 }];
        const restConverted =
          parseInt(restMinutes) * 60 * 60 + parseInt(restSeconds) * 60;
        const exerciseToAdd = {
          exercise: exerciseID,
          exerciseName: exerciseName,
          muscleGroup: name,
          rest: restConverted,
          customSets: customSets,
        };
        dispatch(addExercise(exerciseToAdd));
        closeModal();
      }
    }
  };

  const addToExistingWorkout = () => {
    if (!isCardio) {
      if (!charge || !nbReps || !nbSets || !restMinutes || !restSeconds) {
        setEmptyFields(true);
      } else {
        setEmptyFields(false);
        let customSets = [];
        for (let i = 0; i < parseInt(nbSets); i++) {
          customSets.push({ weight: parseInt(charge), reps: parseInt(nbReps) });
        }
        const restConverted =
          parseInt(restMinutes) * 60 + parseInt(restSeconds);
        const exerciseToAdd = {
          exercise: exerciseID,
          rest: restConverted,
          customSets: customSets,
        };
        closeModal();
        setIsLoading(true);
        fetch(
          `${process.env.EXPO_PUBLIC_SERVER_IP}/usersWorkouts/addExercise`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ workoutID, exerciseToAdd }),
          }
        )
          .then((response) => response.json())
          .then((data) => {
            dispatch(
              updateExercises({
                workoutID: workoutID,
                exercisesToUpdate: data.updatedWorkout.exercises,
              })
            );
            setIsLoading(false);
          });
      }
    } else {
      if (!charge || !restMinutes || !restSeconds) {
        setEmptyFields(true);
      } else {
        setEmptyFields(false);
        const customSets = [{ weight: parseInt(charge), reps: 1 }];
        const restConverted =
          parseInt(restMinutes) * 60 * 60 + parseInt(restSeconds) * 60;
        const exerciseToAdd = {
          exercise: exerciseID,
          rest: restConverted,
          customSets: customSets,
        };
        closeModal();
        setIsLoading(true);
        fetch(
          `${process.env.EXPO_PUBLIC_SERVER_IP}/usersWorkouts/addExercise`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ workoutID, exerciseToAdd }),
          }
        )
          .then((response) => response.json())
          .then((data) => {
            dispatch(
              updateExercises({
                workoutID: workoutID,
                exercisesToUpdate: data.updatedWorkout.exercises,
              })
            );
            setIsLoading(false);
          });
      }
    }
  };

  const exercisesToShow = exercisesList
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((exercise, i) => {
      const muscleGroup = exercise.muscleGroupe.toLowerCase();
      const imagePath = images[muscleGroup][exercise.image];
      return (
        <ExerciseBtn
          key={i}
          exerciseID={exercise._id}
          textButton={exercise.name}
          image={imagePath}
          openModal={openModal}
          accessibilityLabel={`Sélectionné l'exercice ${exercise.name}`}
          accessibilityHint="Une modale va s'ouvir permettant d'entrer des données personalisés pour l'exercice"
          workoutID={workoutID}
          isWorkoutAlreadyCreated={isWorkoutAlreadyCreated}
        />
      );
    });

  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <KeyboardAvoidingView
          style={styles.modalBackground}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalView}>
            <View style={styles.crossContainer}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={closeModal}
                accessibilityLabel="Fermer la modale"
              >
                <FontAwesome
                  name={"times"}
                  size={30}
                  color={"white"}
                  style={styles.infoIcon}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.modalTitleContainer}>
              <Text style={styles.modalTitle}>{exerciseName}</Text>
              <Underline width={70} />
            </View>
            <View style={styles.infoContainer}>
              <FontAwesome
                name={"info-circle"}
                size={20}
                color={"#A3FD01"}
                style={styles.infoIcon}
              />
              <Text style={styles.textInfo}>
                Saisis tes données pour suivre ta progression !
              </Text>
            </View>
            <View style={styles.inputsContainer}>
              {isCardio ? (
                <Text style={styles.inputText}>Resistance / Inclinaison</Text>
              ) : (
                <Text style={styles.inputText}>Charge (Kg)</Text>
              )}
              <TextInput
                style={styles.input}
                placeholder={isCardio ? "Resistance/Inclinaison" : "Charge"}
                keyboardType="numeric"
                onChangeText={(value) => setCharge(value)}
                value={charge}
                accessibilityLabel="Entrez la charge ou la résistance pour l'exercice"
              ></TextInput>
              {!isCardio && (
                <>
                  <Text style={styles.inputText}>Nombre de séries</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Nombre de séries"
                    keyboardType="numeric"
                    onChangeText={(value) => setNbSets(value)}
                    accessibilityLabel="Entrez le nombres de série pour l'exercice"
                    value={nbSets}
                  ></TextInput>

                  <Text style={styles.inputText}>Nombre de répétitions</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Nombre de répétitions"
                    keyboardType="numeric"
                    onChangeText={(value) => setNbReps(value)}
                    accessibilityLabel="Entrez le nombres de répétitions pour l'exercice"
                    value={nbReps}
                  ></TextInput>
                </>
              )}
              {isCardio ? (
                <Text style={styles.inputText}>Durée</Text>
              ) : (
                <Text style={styles.inputText}>Temps de repos</Text>
              )}
              <View style={styles.restTimeContainer}>
                <TextInput
                  style={styles.restInput}
                  placeholder="Minutes"
                  keyboardType="numeric"
                  onChangeText={(value) => setRestMinutes(value)}
                  accessibilityLabel="Entrez le nombres de minutes pour l'exercice"
                  value={restMinutes}
                ></TextInput>
                <Text style={styles.inputText}>{isCardio ? "h" : "min"}</Text>
                <TextInput
                  style={styles.restInput}
                  placeholder="Secondes"
                  keyboardType="numeric"
                  onChangeText={(value) => setRestSeconds(value)}
                  accessibilityLabel="Entrez le nombres de secondes pour l'exercice"
                  value={restSeconds}
                ></TextInput>
                <Text style={styles.inputText}>{isCardio ? "min" : "sec"}</Text>
              </View>
            </View>
            {emptyFields && (
              <Text style={styles.errorMessage}>
                Veuillez remplir tous les champs
              </Text>
            )}
            <Button
              textButton="Ajouter à la séance"
              textColor="#A3FD01"
              width="260"
              height="40"
              accessibilityLabel="Ajouter l'exercice avec les modifications faites à la séance"
              accessibilityHint="Ferme la modale"
              background="#272D34"
              borderWidth={1}
              borderColor="#A3FD01"
              onPress={
                !isWorkoutAlreadyCreated ? addToWorkout : addToExistingWorkout
              }
            ></Button>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <View style={styles.topContainer}>
        <FontAwesome
          name={"chevron-left"}
          size={24}
          color={"#3BC95F"}
          onPress={() =>
            navigation.navigate("muscleGroup", {
              isWorkoutAlreadyCreated,
              workoutID,
            })
          }
          accessibilityLabel="Revenir sur la page pour choisir le groupe musculaire"
          style={{ marginLeft: 15, marginTop: 5 }}
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
          {exercisesToShow}
        </ScrollView>
      </View>

      <View style={styles.bottomContainer}>
        <Button
          background="#A3FD01"
          borderColor="none"
          textButton="Terminer"
          textColor="black"
          width={240}
          height={50}
          onPress={handleFinish}
          isLinearGradiant={false}
          accessibilityLabel="Revenir sur la page pour choisir le groupe musculaire"
        />
      </View>
      {isLoading && (
        <View style={styles.backgroundLoading}>
          <ActivityIndicator size="large" color="#A3FD01" animating={true} />
        </View>
      )}
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
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
  modalView: {
    width: "80%",
    height: "600",
    margin: 20,
    backgroundColor: "#272D34",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  crossContainer: {
    width: "100%",
    alignItems: "flex-end",
  },
  modalTitleContainer: {
    width: "100%",
    marginTop: "15",
  },
  modalTitle: {
    fontSize: 22,
    color: "white",
    fontWeight: 600,
  },
  infoContainer: {
    width: "100%",
    flexDirection: "row",
    marginTop: "15",
    alignItems: "center",
  },
  textInfo: {
    color: "white",
    paddingLeft: 10,
  },
  inputsContainer: {
    width: "100%",
    marginTop: 40,
  },
  inputText: {
    color: "white",
    marginBottom: 5,
    marginHorizontal: 5,
  },
  input: {
    width: "100%",
    height: 35,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  restTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  restInput: {
    width: "35%",
    height: 35,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
  },
  backgroundLoading: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
