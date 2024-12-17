import { StyleSheet, Text, View, ScrollView, Modal, KeyboardAvoidingView, Platform, TextInput, Alert } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Button from "../components/Button";
import ExerciseCard from "../components/ExerciseCard";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Underline from "../components/Underline";
import { removeWorkout, removeExercise, updateWorkoutSets } from "../reducers/workouts";
import { addWorkoutInformation, resetCurrentWorkout } from "../reducers/currentWorkout";

export default function WorkoutSummaryScreen({ navigation, route }) {
  const { workoutID } = route.params || {};

  const [isEditable, setIsEditable] = useState(true);
  const [modalCustomSetsVisible, setmodalCustomSetsVisible] = useState(false);
  const [exerciseName, setExerciseName] = useState("");
  const [exerciseID, setExerciseID] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("")
  const [charge, setCharge] = useState("");
  const [nbSets, setNbSets] = useState("");
  const [nbReps, setNbReps] = useState("");
  const [restMinutes, setRestMinutes] = useState("1");
  const [restSeconds, setRestSeconds] = useState("00");
  const [emptyFields, setEmptyFields] = useState(false);

  const dispatch = useDispatch()

  // Récupération des séances dans le reducer puis sélection de la séance sélectionnée
  const workouts = useSelector((state) => state.workouts.value)
  const workoutSelected = workouts.find(workout => workout._id === workoutID)
  // Récupération de tous les exercices de la séance et tri par groupe musculaire
  const groupedWorkoutExercises = workoutSelected.exercises.reduce(
    (groups, exercise) => {
      const { muscleGroupe } = exercise.exercise;
      if (!groups[muscleGroupe]) {
        groups[muscleGroupe] = [];
      }
      groups[muscleGroupe].push(exercise);
      return groups;
    },
    {}
  );

  // Récupération de l'historique de la séance en cours
  const currentWorkout = useSelector(state => state.currentWorkout.value)
  // console.log(currentWorkout.performances[0].sets)
  
  // Récupération de l'utilisateur connecté
  const user = useSelector(state => state.user.value)
 
  const handleDeleteExercise = (exerciseID) => {
    const exerciseToRemove = {
      workoutID : workoutID,
      exerciseID : exerciseID
    }
    fetch(`${process.env.EXPO_PUBLIC_SERVER_IP}/usersWorkouts/deleteExercise`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(exerciseToRemove),
    }).then(response => response.json())
    .then(data => {
      if(data.result === true){
        dispatch(removeExercise(exerciseToRemove))
      }
    })   
  }

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
    setMuscleGroup(muscleGroup)
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
    setMuscleGroup("")
  };

  const handleUpdateExercise = () => {
    if (!charge || !nbSets || !nbReps || !restSeconds || !restMinutes){
      setEmptyFields(true)
      return
    }
    setEmptyFields(false)
    let customSets = [];
    for (let i = 0; i < parseInt(nbSets); i++) {
      customSets.push({ weight: parseInt(charge), reps: parseInt(nbReps) });
    }
    let restConverted
    if (muscleGroup != "Cardio"){
      restConverted = parseInt(restMinutes) * 60 + parseInt(restSeconds);
    } else {
      restConverted = parseInt(restMinutes) * 3600 + parseInt(restSeconds) * 60;
    }
    const updateExerciseSets = {
      workoutID : workoutID,
      exerciseID : exerciseID,
      customSets : customSets,
      rest : restConverted
    }

    fetch(`${process.env.EXPO_PUBLIC_SERVER_IP}/usersWorkouts/updateSets`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateExerciseSets),
    }).then(response => response.json())
    .then(data => {
      if(data.result === true){
        dispatch(updateWorkoutSets(updateExerciseSets))
        closeModalCustomSets()
      }
    }) 
  }

  const startExercise = (exerciseID) => {
    navigation.navigate("exercice", {
      exerciseID: exerciseID,
      workoutID: workoutID
    })
  }

  const handlePressButton = () => {
    if (isEditable){
      setIsEditable(false)
      const informationToAdd = {
        userToken : user.token,
        workoutID : workoutID,
      }
      dispatch(addWorkoutInformation(informationToAdd))
    } else {
      navigation.navigate("workoutEnding")
    }
  }

  const handleGoToHome = () => {
    if (currentWorkout.workout){
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
              dispatch(resetCurrentWorkout())
              navigation.navigate("Home")
            },
          },
        ]
      );
    } else {
      navigation.navigate("Home")
    }
  }
  
  
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
        let minutes
        let seconds
        if(muscleGroup != "Cardio"){
          minutes = Math.floor(exercise.rest / 60);
          seconds = exercise.rest % 60;
        } else {
          minutes = Math.floor(exercise.rest / 3600);
          seconds = Math.floor((exercise.rest % 3600) / 60)
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
          />
        );
      }
    );
    exercisesToShow.push(newExercisesToAdd);
  }
  
  const handleDeleteWorkout = () => {
    fetch(`${process.env.EXPO_PUBLIC_SERVER_IP}/usersWorkouts/deleteWorkout/${workoutID}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    }).then(response => response.json())
    .then(data => {
      if(data.deleted > 0){
        dispatch(removeWorkout(workoutID))
      navigation.navigate('Home')
      }
    })
  }


  return (
    <View style={styles.container}>
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
                onPress={() => navigation.navigate("muscleGroup")}
                style={styles.infoIcon}
              />
              <Text style={styles.textInfo}>
                Saisis tes données pour suivre ta progression !
              </Text>
            </View>
            <View style={styles.inputsContainer}>
              <Text style={styles.inputText}>{muscleGroup === "Cardio" ? "Résistance/Inclinaison" : "Charge (Kg)"}</Text>
              <TextInput
                style={styles.input}
                placeholder={muscleGroup === "Cardio" ? "Résistance/Inclinaison" : "Charge"}
                keyboardType="numeric"
                onChangeText={(value) => setCharge(value)}
                value={charge}
              ></TextInput>
              {muscleGroup != "Cardio" && <>
              <Text style={styles.inputText}>Nombre de séries</Text>
              <TextInput
                style={styles.input}
                placeholder="Nombre de séries"
                keyboardType="numeric"
                onChangeText={(value) => setNbSets(value)}
                value={nbSets}
              ></TextInput>
              <Text style={styles.inputText}>Nombre de répétitions</Text>
              <TextInput
                style={styles.input}
                placeholder="Nombre de répétitions"
                keyboardType="numeric"
                onChangeText={(value) => setNbReps(value)}
                value={nbReps}
              ></TextInput>
              </>}
              <Text style={styles.inputText}>Temps de repos</Text>
              <View style={styles.restTimeContainer}>
                <TextInput
                  style={styles.restInput}
                  placeholder="Minutes"
                  keyboardType="numeric"
                  onChangeText={(value) => setRestMinutes(value)}
                  value={restMinutes}
                ></TextInput>
                <Text style={styles.inputText}>{muscleGroup != "Cardio"? "min": "h"}</Text>
                <TextInput
                  style={styles.restInput}
                  placeholder="Secondes"
                  keyboardType="numeric"
                  onChangeText={(value) => setRestSeconds(value)}
                  value={restSeconds}
                ></TextInput>
                <Text style={styles.inputText}>{muscleGroup != "Cardio"? "sec": "min"}</Text>
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
        />
        <Text style={styles.topTitle}>{workoutSelected.name}</Text>
        <FontAwesome name="trash" size={24} color={"#A3FD01"} onPress={handleDeleteWorkout}/>
      </View>

      <View style={styles.mainContainer}>
        <ScrollView>
          {exercisesToShow}
        </ScrollView>
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
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    height: "570",
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
