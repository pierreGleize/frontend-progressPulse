import {
  StyleSheet,
  View,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Text,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Button from "../components/Button";
import ExerciseCard from "../components/ExerciseCard";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import {
  updateCustomSets,
  addWorkoutName,
  resetWorkoutCreation,
  removeExercise,
} from "../reducers/workoutCreation";
import { addWorkout } from "../reducers/workouts";
import Underline from "../components/Underline";
import imagesWorkout from "../utils/imagesWorkout";

export default function WorkoutSummaryScreen({ navigation, route }) {
  const { backTo, categorie = {}, name } = route.params || {};
  console.log(backTo, categorie, name);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const workouts = useSelector((state) => state.workouts.value);

  const randomImage = Math.floor(Math.random() * imagesWorkout.length);
  console.log(imagesWorkout[randomImage].name);

  const [modalCustomSetsVisible, setmodalCustomSetsVisible] = useState(false);
  const [modalTitleVisible, setModalTitleVisible] = useState(false);
  const [exerciseName, setExerciseName] = useState("");
  const [exerciseID, setExerciseID] = useState("");
  const [charge, setCharge] = useState("");
  const [nbSets, setNbSets] = useState("");
  const [nbReps, setNbReps] = useState("");
  const [restMinutes, setRestMinutes] = useState("1");
  const [restSeconds, setRestSeconds] = useState("00");
  const [emptyFields, setEmptyFields] = useState(false);
  const [workoutName, setWorkoutName] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");
  const [postError, setPostError] = useState(false);

  const closeModalCustomSets = () => {
    setmodalCustomSetsVisible(false);
    setExerciseName("");
    setExerciseID("");
    setMuscleGroup("");
    setCharge("");
    setNbReps("");
    setNbSets("");
    setRestMinutes("");
    setRestSeconds("");
  };

  const openModalCustomSets = (
    exerciseName,
    exerciseID,
    charge,
    nbReps,
    nbSets,
    restMinutes,
    restSeconds,
    muscleGroup
  ) => {
    setExerciseName(exerciseName);
    setExerciseID(exerciseID);
    setCharge(charge.toString());
    setNbReps(nbReps.toString());
    setNbSets(nbSets.toString());
    setRestMinutes(restMinutes.toString());
    setRestSeconds(restSeconds.toString());
    setmodalCustomSetsVisible(true);
    setMuscleGroup(muscleGroup);
  };

  const handleDelete = (exerciseID) => {
    dispatch(removeExercise(exerciseID));
  };

  const updateExercise = () => {
    if (!charge || !nbSets || !nbReps || !restSeconds || !restMinutes) {
      setEmptyFields(true);
      return;
    }
    setEmptyFields(false);
    let customSets = [];
    for (let i = 0; i < parseInt(nbSets); i++) {
      customSets.push({ weight: parseInt(charge), reps: parseInt(nbReps) });
    }
    let restConverted;
    if (muscleGroup != "Cardio") {
      restConverted = parseInt(restMinutes) * 60 + parseInt(restSeconds);
    } else {
      restConverted = parseInt(restMinutes) * 3600 + parseInt(restSeconds) * 60;
    }
    const exerciseToUpdate = {
      exerciseID: exerciseID,
      newSets: customSets,
      rest: restConverted,
    };
    dispatch(updateCustomSets(exerciseToUpdate));
    closeModalCustomSets();
  };

  const workout = useSelector((state) => state.workoutCreation.value);
  const groupedWorkoutExercises = workout.exercises.reduce(
    (groups, exercise) => {
      const { muscleGroup } = exercise;
      if (!groups[muscleGroup]) {
        groups[muscleGroup] = [];
      }
      groups[muscleGroup].push(exercise);
      return groups;
    },
    {}
  );

  let exercisesToShow = [];

  for (let muscleGroup in groupedWorkoutExercises) {
    exercisesToShow.push(
      <View style={styles.groupTitleSection} key={muscleGroup}>
        <Text style={styles.groupTitle}>{muscleGroup}</Text>
        <Underline width={40} />
      </View>
    );
    const newExercisesToAdd = groupedWorkoutExercises[muscleGroup].map(
      (exercise, i) => {
        let minutes;
        let seconds;
        if (muscleGroup != "Cardio") {
          minutes = Math.floor(exercise.rest / 60);
          seconds = exercise.rest % 60;
        } else {
          minutes = Math.floor(exercise.rest / 3600);
          seconds = Math.floor((exercise.rest % 3600) / 60);
        }
        return (
          <ExerciseCard
            key={i}
            exerciseName={exercise.exerciseName}
            muscleGroup={muscleGroup}
            numberOfSets={exercise.customSets.length}
            numberOfReps={exercise.customSets[0].reps}
            weight={exercise.customSets[0].weight}
            restMinutes={minutes}
            restSeconds={seconds}
            exerciseID={exercise.exercise}
            openModalCustomSets={openModalCustomSets}
            handleDelete={handleDelete}
          />
        );
      }
    );
    exercisesToShow.push(newExercisesToAdd);
  }

  const handleSubmit = () => {
    if (!workoutName) {
      setEmptyFields(true);
    } else {
      setEmptyFields(false);
      dispatch(addWorkoutName(workoutName));
      let exercices = [];
      for (let exercise of workout.exercises) {
        exercices.push({
          exercise: exercise.exercise,
          rest: exercise.rest,
          customSets: exercise.customSets,
        });
      }
      const workoutToAdd = {
        userToken: user.token,
        name: workoutName,
        exercices: exercices,
        image: imagesWorkout[randomImage].name,
      };
      fetch(`${process.env.EXPO_PUBLIC_SERVER_IP}/usersWorkouts/addWorkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workoutToAdd),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.result === true) {
            setPostError(false);
            const workoutToAddToStore = {
              _id: data.userWorkout._id,
              name: data.userWorkout.name,
              exercises: data.userWorkout.exercises,
              image: data.userWorkout.image,
            };
            dispatch(addWorkout(workoutToAddToStore));
            setModalTitleVisible(false);
            dispatch(resetWorkoutCreation());
            navigation.navigate("Home");
          } else {
            setPostError(true);
          }
        });
    }
  };

  return (
    <View style={styles.container}>
      {/* Modal pour nommer la séance */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalTitleVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalTitleVisible(false);
        }}
      >
        <KeyboardAvoidingView
          style={styles.modalBackground}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalTitleView}>
            <View style={styles.crossContainer}>
              <FontAwesome
                name={"times"}
                size={30}
                color={"white"}
                onPress={() => setModalTitleVisible(false)}
                style={styles.infoIcon}
                accessibilityLabel="Fermer la modale"
              />
            </View>
            <View style={styles.infoContainer}>
              <FontAwesome
                name={"info-circle"}
                size={30}
                color={"#A3FD01"}
                style={styles.infoIcon}
              />
              <Text style={styles.textInfo}>Nomme ta séance</Text>
            </View>
            <View style={styles.inputsContainer}>
              <Text style={styles.inputText}>Nom de la séance</Text>
              <TextInput
                style={styles.input}
                placeholder="Saisis un nom"
                accessibilityLabel="Donner un nom à la séance"
                onChangeText={(value) => setWorkoutName(value)}
                value={workoutName}
              ></TextInput>
            </View>
            {emptyFields && (
              <Text style={styles.errorMessage}>
                Veuillez saisir un nom de séance
              </Text>
            )}
            {postError && (
              <Text style={styles.errorMessage}>
                Ce nom est déjà attribué à l'une de vos séances. Choissisez un
                autre nom
              </Text>
            )}
            <Button
              textButton="Valider ma séance"
              textColor="#A3FD01"
              width="260"
              height="40"
              background="#272D34"
              borderWidth={1}
              borderColor="#A3FD01"
              onPress={handleSubmit}
              accessibilityLabel="Valider le nom donné à la séance"
              accessibilityHint="Vous serez redirigé vers la d'accueil après la validation. Votre séance crée s'affichera sur cette page"
            ></Button>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      {/* Modal pour modifier les objetctifs de l'exercice */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalCustomSetsVisible}
      >
        <KeyboardAvoidingView
          style={styles.modalBackground}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalView}>
            <View style={styles.crossContainer}>
              <FontAwesome
                name={"times"}
                size={30}
                color={"white"}
                onPress={closeModalCustomSets}
                accessibilityLabel="Fermer la modale"
                style={styles.infoIcon}
              />
            </View>
            <View style={styles.modalTitleContainer}>
              <Text style={styles.modalTitle}>{exerciseName}</Text>
              <Underline width={70} />
            </View>
            <View style={styles.infoContainer}>
              <FontAwesome
                name={"info-circle"}
                size={30}
                color={"#A3FD01"}
                style={styles.infoIcon}
              />
              <Text style={styles.textInfo}>
                Saisis tes données pour suivre ta progression !
              </Text>
            </View>
            <View style={styles.inputsContainer}>
              <Text style={styles.inputText}>
                {muscleGroup === "Cardio"
                  ? "Resistance/Inclinaison"
                  : "Charge (Kg)"}
              </Text>
              <TextInput
                style={styles.input}
                accessibilityLabel="Modifier si besoin la charge ou la résistance de l'exercice"
                placeholder={
                  muscleGroup === "Cardio" ? "Résistance/Inclinaison" : "Charge"
                }
                keyboardType="numeric"
                onChangeText={(value) => setCharge(value)}
                value={charge}
              ></TextInput>
              {muscleGroup != "Cardio" && (
                <>
                  <Text style={styles.inputText}>Nombre de séries</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Nombre de séries"
                    accessibilityLabel="Modifier si besoin le nombre de série de l'exercice"
                    keyboardType="numeric"
                    onChangeText={(value) => setNbSets(value)}
                    value={nbSets}
                  ></TextInput>
                  <Text style={styles.inputText}>Nombre de répétitions</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Nombre de répétitions"
                    accessibilityLabel="Modifier si besoin le nombre de répétitions de l'exercice"
                    keyboardType="numeric"
                    onChangeText={(value) => setNbReps(value)}
                    value={nbReps}
                  ></TextInput>
                </>
              )}
              <Text style={styles.inputText}>
                {muscleGroup === "Cardio" ? "Durée" : "Temps de repos"}
              </Text>
              <View style={styles.restTimeContainer}>
                <TextInput
                  style={styles.restInput}
                  placeholder="Minutes"
                  keyboardType="numeric"
                  accessibilityLabel="Modifier si besoin le temps de repos en minute de l'exercice"
                  onChangeText={(value) => setRestMinutes(value)}
                  value={restMinutes}
                ></TextInput>
                <Text style={styles.inputText}>
                  {muscleGroup != "Cardio" ? "min" : "h"}
                </Text>
                <TextInput
                  style={styles.restInput}
                  placeholder="Secondes"
                  keyboardType="numeric"
                  accessibilityLabel="Modifier si besoin le temps de repos en seconde de l'exercice"
                  onChangeText={(value) => setRestSeconds(value)}
                  value={restSeconds}
                ></TextInput>
                <Text style={styles.inputText}>
                  {muscleGroup != "Cardio" ? "sec" : "min"}
                </Text>
              </View>
            </View>
            {emptyFields && (
              <Text style={styles.errorMessage}>
                Veuillez remplir tous les champs
              </Text>
            )}
            <Button
              textButton="Modifier les objectifs"
              textColor="#A3FD01"
              width="260"
              height="40"
              background="#272D34"
              borderWidth={1}
              borderColor="#A3FD01"
              onPress={updateExercise}
              accessibilityLabel="Valider les changements apportés à l'exercice"
              eccessibilityHint="Permet également de fermer la modale, on reste toujours sur la même page après cette action"
            ></Button>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      {/* Fin Modal pour modifier les objetctifs de l'exercice */}
      <View style={{ marginBottom: 20 }}>
        <FontAwesome
          name={"chevron-left"}
          accessibilityLabel={`Permet de revenir sur la page ${backTo}`}
          size={24}
          color={"#3BC95F"}
          style={{ marginLeft: 15, marginTop: 5 }}
          onPress={() => navigation.navigate(backTo, { name: name })}
          // onPress={() => navigation.navigate(backTo, { categorie: categorie })}
        />
      </View>
      <View style={styles.mainContainer}>
        <ScrollView>{exercisesToShow}</ScrollView>
      </View>

      <View style={styles.bottomContainer}>
        <Button
          background="#A3FD01"
          borderColor="none"
          textButton={"Valider ma séance"}
          textColor="black"
          width={300}
          height={50}
          onPress={() => setModalTitleVisible(true)}
          isLinearGradiant={false}
          accessibilityLabel="Valider la et accepter si des changements ont été apporté sur la séance"
          accessibilityHint="Redirection sur la page d'accueil, votre séance si affichera"
        />
        <FontAwesome
          name={"plus-circle"}
          accessibilityLabel={`Permet de revenir sur la page ${backTo}`}
          size={45}
          color={"white"}
          style={{ marginRight: 15 }}
          onPress={() => navigation.navigate("muscleGroup")}
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
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  bottomContainer: {
    flex: 0.4,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    width: "100%",
  },
  mainContainer: {
    flex: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  groupTitleSection: {
    justifyContent: "flex-start",
    marginBottom: 10,
    justifyContent: "flex-start",
  },
  groupTitle: {
    color: "white",
    fontSize: 20,
  },

  modalView: {
    width: "80%",
    height: "600",
    margin: 20,
    backgroundColor: "#272D34",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitleView: {
    width: "80%",
    height: "350",
    margin: 20,
    backgroundColor: "#272D34",
    borderRadius: 20,
    padding: 35,
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
    fontSize: 18,
    color: "white",
    fontWeight: "600",
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
  },
  input: {
    width: "100%",
    height: "35",
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
    height: "35",
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
  },
});
