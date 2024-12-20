import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Button from "../components/Button";
import ExerciseCard from "../components/ExerciseCard";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Underline from "../components/Underline";
import {
  removeWorkout,
  removeExercise,
  updateWorkoutSets,
  updateWorkoutName,
} from "../reducers/workouts";
import {
  addWorkoutInformation,
  resetCurrentWorkout,
} from "../reducers/currentWorkout";
import { updateNameWorkoutHistory } from "../reducers/workoutsHistory";

export default function WorkoutSummaryScreen({ navigation, route }) {
  const { workoutID } = route.params || {};

  const [isEditable, setIsEditable] = useState(true);
  const [modalCustomSetsVisible, setmodalCustomSetsVisible] = useState(false);
  const [exerciseName, setExerciseName] = useState("");
  const [exerciseID, setExerciseID] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");
  const [charge, setCharge] = useState("");
  const [nbSets, setNbSets] = useState("");
  const [nbReps, setNbReps] = useState("");
  const [restMinutes, setRestMinutes] = useState("1");
  const [restSeconds, setRestSeconds] = useState("00");
  const [emptyFields, setEmptyFields] = useState(false);
  const [modalTitleVisible, setModalTitleVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  // Récupération des séances dans le reducer puis sélection de la séance sélectionnée
  const workouts = useSelector((state) => state.workouts.value);
  const workoutSelected = workouts.find((workout) => workout._id === workoutID);
  // Récupération de tous les exercices de la séance et tri par groupe musculaire
  //groupedWorkoutExercises` contient un objet où chaque clé est un groupe musculaire et chaque valeur est un tableau des exercices correspondant à ce groupe musculaire.
  const groupedWorkoutExercises = workoutSelected.exercises.reduce(
    //groups c'est l'accumulateur, l'objet contenant le résultat du regroupement, au départ c'est un objet vide.
    (groups, exercise) => {
      const { muscleGroupe } = exercise.exercise;
      // Si le groupe musculaire n'existe pas encore dans l'accumulateur, on l'initialise comme un tableau vide
      if (!groups[muscleGroupe]) {
        groups[muscleGroupe] = [];
      }
      // On ajoute l'exercice au groupe musculaire correspondant
      groups[muscleGroupe].push(exercise);
      return groups;
    },
    //accumulateur initial est un objet vide
    {}
  );

  const [workoutNameInput, setWorkoutNameInput] = useState(
    workoutSelected.name
  );

  // Récupération de l'historique de la séance en cours
  const currentWorkout = useSelector((state) => state.currentWorkout.value);

  // Récupération de l'utilisateur connecté
  const user = useSelector((state) => state.user.value);

  //Permet de supprimer un exercice
  const handleDeleteExercise = (exerciseID) => {
    const exerciseToRemove = {
      workoutID: workoutID,
      exerciseID: exerciseID,
    };
    setIsLoading(true);
    fetch(`${process.env.EXPO_PUBLIC_SERVER_IP}/usersWorkouts/deleteExercise`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(exerciseToRemove),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result === true) {
          dispatch(removeExercise(exerciseToRemove));
          setIsLoading(false);
        }
        setIsLoading(false);
      });
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
    // Mise à jour des états locaux avec les valeurs des arguments passés
    setExerciseName(exerciseName);
    setExerciseID(exerciseID);
    setMuscleGroup(muscleGroup);
    setCharge(charge.toString());
    setNbReps(nbReps.toString());
    setNbSets(nbSets.toString());
    setRestMinutes(restMinutes.toString());
    setRestSeconds(restSeconds.toString());
    setmodalCustomSetsVisible(true);
  };

  const closeModalCustomSets = () => {
    setmodalCustomSetsVisible(false);
    setExerciseName("");
    setExerciseID("");
    setCharge("");
    setNbReps("");
    setNbSets("");
    setRestMinutes("");
    setRestSeconds("");
    setMuscleGroup("");
  };

  const handleChangeName = () => {
    if (workoutNameInput) {
      setEmptyFields(false);
      setModalTitleVisible(false);
      setIsLoading(true);
      fetch(`${process.env.EXPO_PUBLIC_SERVER_IP}/usersWorkouts/updateName`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workoutID: workoutID,
          newWorkoutName: workoutNameInput,
          token: user.token,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.result) {
            dispatch(
              updateWorkoutName({
                workoutID: workoutID,
                newName: workoutNameInput,
              })
            );
            dispatch(
              updateNameWorkoutHistory({
                workoutID: workoutID,
                newName: workoutNameInput,
              })
            );
            setIsLoading(false);
          } else {
            setEmptyFields(true);
            setIsLoading(false);
          }
        });
    } else {
      setEmptyFields(true);
      setIsLoading(false);
    }
  };

  const handleUpdateExercise = () => {
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
    const updateExerciseSets = {
      workoutID: workoutID,
      exerciseID: exerciseID,
      customSets: customSets,
      rest: restConverted,
    };
    closeModalCustomSets();
    setIsLoading(true);
    fetch(`${process.env.EXPO_PUBLIC_SERVER_IP}/usersWorkouts/updateSets`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateExerciseSets),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result === true) {
          dispatch(updateWorkoutSets(updateExerciseSets));
        }
        setIsLoading(false);
      });
  };

  const startExercise = (exerciseID) => {
    navigation.navigate("exercice", {
      exerciseID: exerciseID,
      workoutID: workoutID,
    });
  };

  const handlePressButton = () => {
    if (isEditable) {
      setIsEditable(false);
      const informationToAdd = {
        userToken: user.token,
        workoutID: workoutID,
      };
      dispatch(addWorkoutInformation(informationToAdd));
    } else {
      console.log(workoutID);
      navigation.navigate("workoutEnding", { workoutID: workoutID });
    }
  };

  const handleGoToHome = () => {
    if (currentWorkout.workout) {
      Alert.alert(
        "Attention", // Titre
        "La séance est démarée, en quittant cette page vous perdrez votre progression.", // Message
        [
          {
            text: "Annuler",
            style: "cancel",
          },
          {
            text: "Abandonner ma séance",
            onPress: () => {
              dispatch(resetCurrentWorkout());
              navigation.navigate("Home");
            },
          },
        ]
      );
    } else {
      navigation.navigate("Home");
    }
  };

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
            exerciseName={exercise.exercise.name}
            muscleGroup={muscleGroup}
            numberOfSets={exercise.customSets.length}
            numberOfReps={exercise.customSets[0].reps}
            weight={exercise.customSets[0].weight}
            restMinutes={minutes}
            restSeconds={seconds}
            exerciseID={exercise.exercise._id}
            handleDelete={handleDeleteExercise}
            openModalCustomSets={openModalCustomSets}
            isEditable={isEditable}
            startExercise={startExercise}
            accessibilityLabel={`Commencer l'exercice ${exercise.exercise.name}`}
          />
        );
      }
    );
    exercisesToShow.push(newExercisesToAdd);
  }

  const handleDeleteWorkout = () => {
    setIsLoading(true);
    fetch(
      `${process.env.EXPO_PUBLIC_SERVER_IP}/usersWorkouts/deleteWorkout/${workoutID}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.deleted > 0) {
          dispatch(removeWorkout(workoutID));
          navigation.navigate("Home");
        }
        setIsLoading(false);
      });
  };

  const openAlertDeleteWorkout = () => {
    Alert.alert(
      "Attention", // Titre
      "Êtes-vous sûr de vouloir supprimer cette séance ? Notez que l'historique associé à cette séance restera accessible dans la section suivie de séance", // Message
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
          onPress: () => {
            handleDeleteWorkout();
          },
        },
      ]
    );
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
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setModalTitleVisible(false)}
              >
                <FontAwesome
                  name={"times"}
                  size={30}
                  color={"white"}
                  style={styles.infoIcon}
                />
              </TouchableOpacity>
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
              <Text style={styles.inputText}>Renomme ta séance</Text>
              <TextInput
                style={styles.input}
                placeholder="Saisis un nom"
                onChangeText={(value) => setWorkoutNameInput(value)}
                value={workoutNameInput}
              ></TextInput>
            </View>
            {emptyFields && (
              <Text style={styles.errorMessage}>
                Veuillez saisir un nom de séance
              </Text>
            )}
            <Button
              textButton="Renommer ma séance"
              textColor="#A3FD01"
              width="260"
              height="40"
              background="#272D34"
              borderWidth={1}
              borderColor="#A3FD01"
              onPress={handleChangeName}
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
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={closeModalCustomSets}
              >
                <FontAwesome
                  name={"times"}
                  size={30}
                  color={"white"}
                  accessibilityLabel="Fermer la modale"
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
                  ? "Résistance/Inclinaison"
                  : "Charge (Kg)"}
              </Text>
              <TextInput
                style={styles.input}
                accessibilityLabel="Permet de modfier la charge ou l'inclinaison de l'exercice"
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
                    accessibilityLabel="Permet de modifier le nombres de séries de l'exercice"
                    placeholder="Nombre de séries"
                    keyboardType="numeric"
                    onChangeText={(value) => setNbSets(value)}
                    value={nbSets}
                  ></TextInput>
                  <Text style={styles.inputText}>Nombre de répétitions</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Nombre de répétitions"
                    accessibilityLabel="Permet de modifier le nombre de répétitions de l'exercice"
                    keyboardType="numeric"
                    onChangeText={(value) => setNbReps(value)}
                    value={nbReps}
                  ></TextInput>
                </>
              )}
              <Text style={styles.inputText}>Temps de repos</Text>
              <View style={styles.restTimeContainer}>
                <TextInput
                  style={styles.restInput}
                  placeholder="Minutes"
                  keyboardType="numeric"
                  accessibilityLabel="Permet de modifier le temps de repos en minutes"
                  accessibilityHint="Si c'est un exercice cardio, modifier l'heure de l'exercice"
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
                  accessibilityLabel="Permet de modifier le temps de repos en secondes"
                  accessibilityHint="Si c'est un exercice cardio, modifier les minutes de l'exercice"
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
              onPress={handleUpdateExercise}
              accessibilityLabel="Valider les modifications apportés"
              accessibilityHint="Ferme également la modale"
            ></Button>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <View style={styles.topContainer}>
        <FontAwesome
          name={"chevron-left"}
          size={24}
          color={"#3BC95F"}
          onPress={handleGoToHome}
          accessibilityLabel="Redirection vers la page d'accueil"
        />
        <View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setModalTitleVisible(!modalTitleVisible)}
            style={styles.workoutNameSection}
          >
            <Text style={styles.topTitle}>{workoutSelected.name}</Text>
            <FontAwesome
              style={styles.pencilLogo}
              name="pencil"
              size={18}
              color={"white"}
            />
          </TouchableOpacity>
        </View>
        <FontAwesome
          name={isEditable ? "trash" : ""}
          size={24}
          color={"#A3FD01"}
          onPress={openAlertDeleteWorkout}
        />
      </View>

      <View style={styles.mainContainer}>
        <ScrollView>{exercisesToShow}</ScrollView>
      </View>
      <View style={styles.bottomContainer}>
        <Button
          background="#A3FD01"
          borderColor="none"
          textButton={isEditable ? "Commencer la séance" : "Terminer la séance"}
          textColor="black"
          width={300}
          height={50}
          onPress={handlePressButton}
          isLinearGradiant={false}
          accessibilityLabel={
            isEditable
              ? "Permet de commencer la séance"
              : "Permet de terminer la séance"
          }
          accessibilityHint={
            isEditable &&
            "Redirection vers la page pour donner son avis sur la séance"
          }
        />
        <FontAwesome
          name={"plus-circle"}
          accessibilityLabel={`Permet de rajouter un nouveau exercice`}
          size={45}
          color={"white"}
          style={{ marginRight: 15 }}
          onPress={() =>
            navigation.navigate("muscleGroup", {
              isWorkoutAlreadyCreated: true,
              workoutID: workoutID,
            })
          }
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
    flex: 0.8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    width: "100%",
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
  workoutNameSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  pencilLogo: {
    marginLeft: 10,
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
