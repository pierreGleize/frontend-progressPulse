import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
  Dimensions,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Button from "../components/Button";
import Underline from "../components/Underline";
import { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";
import images from "../utils/images";
import { Image } from "expo-image";

export default function Exercice({ navigation, route }) {
  const { workoutID, exerciseID } = route.params || {};

  // Récupération de la largeur de l'écran
  const screenWidth = Dimensions.get("window").width;

  // Récupération des l'ensemble des séance
  const workouts = useSelector((state) => state.workouts.value);
  // Recherche de la séance avec le workoutID reçu en props
  const workoutSelected = workouts.find((workout) => workout._id === workoutID);
  // Recherche de l'exercice avec l'exerciseID reçu en propsd
  const exerciseSelected = workoutSelected.exercises.find(
    (exercise) => exercise.exercise._id === exerciseID
  );
  // Stockage du nom du groupe musculaire de l'exercice sélectionné
  const muscleGroup = exerciseSelected.exercise.muscleGroupe;
  // Recherche de l'image correspondant à l'exercice
  const imagePath =
    images[exerciseSelected.exercise.muscleGroupe.toLowerCase()][
      exerciseSelected.exercise.image
    ];
  // Transformation du paragraphe de descripiton en tableau
  const descriptionSentences =
    exerciseSelected.exercise.description.split(/(?<=[.!?])\s+/);
  const descriptionSetencesToShow = descriptionSentences.map((sentence, i) => {
    return (
      <Text style={styles.sentence} key={i}>
        {i + 1} - {sentence}
      </Text>
    );
  });

  const [currentSet, setCurrentSet] = useState(1);
  const [noHistory, setNoHistory] = useState(true);

  // Récupération des performances de la séance en cours
  const currentWorkout = useSelector((state) => state.currentWorkout.value);
  // Vérification si l'exercice est présent dans le reducers et combien de sets ont été enregistrés
  useEffect(() => {
    const exerciseExist = currentWorkout.performances.find(
      (e) => e.exercise === exerciseID
    );
    if (exerciseExist) {
      setCurrentSet(exerciseExist.sets.length + 1);
    }
  }, [currentWorkout]);

  // Récupération de l'historique de performance pour cette séance et cet exercice
  const workoutsHistory = useSelector((state) => state.workoutsHistory.value);
  const currentWorkoutHistory = workoutsHistory.filter(
    (workout) => workout.workoutID === workoutID
  );
  // Tri de l'historique par date la plus récente à la plus ancienne
  const sortedCurrentWorkoutHistory = currentWorkoutHistory.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  let mostRecentWorkout = null;
  let mostRecentExercise = null;
  let mostRecentSets = [];

  const exerciseHistoryToShow = sortedCurrentWorkoutHistory.map(
    (history, i) => {
      const year = history.date.slice(0, 4);
      const month = history.date.slice(5, 7);
      const day = history.date.slice(8, 10);
      const fullDate = `${day}/${month}/${year}`;
      return history.performances
        .map((performance) => {
          if (performance.exercise._id === exerciseID) {
            return (
              <ScrollView key={i}>
                <Text style={styles.performanceDate}>{fullDate}</Text>
                <View style={[styles.perfSection, { width: screenWidth }]}>
                  {performance.sets.map((set, j) => {
                    return (
                      <LinearGradient
                        key={j}
                        colors={["#1C1C45", "#4645AB"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.linearPerf}
                      >
                        <Text style={styles.perf}>
                          Série {j + 1} : {set.reps} x {set.weight}kg
                        </Text>
                      </LinearGradient>
                    );
                  })}
                </View>
              </ScrollView>
            );
          }
          return null;
        })
        .filter((item) => item !== null);
    }
  );

  useEffect(() => {
    for (let exercise of exerciseHistoryToShow) {
      console.log(exercise.length);
      if (exercise.length != 0) return setNoHistory(false);
    }
  }, [exerciseHistoryToShow]);

  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.iconModal}>
            <FontAwesome
              name={"times"}
              size={30}
              color={"white"}
              onPress={closeModal}
              style={styles.infoIcon}
              accessibilityLabel="Permet de fermer la modale"
            />
          </View>
          <View style={styles.titleModal}>
            <Text style={styles.text}>{exerciseSelected.exercise.name}</Text>
            <Underline width={80} />
          </View>
          <View style={styles.descriptionContainer}>
            <ScrollView>{descriptionSetencesToShow}</ScrollView>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.btn}
            onPress={closeModal}
            accessibilityLabel="Permet de fermer la modale"
          >
            <Text style={styles.textButton}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <View>
        <View style={styles.imageContainer}>
          <View style={styles.arrowContainer}>
            <FontAwesome
              name={"chevron-left"}
              size={24}
              color={"#3BC95F"}
              accessibilityLabel="Redirection vers la page pour choisir un exercice"
              onPress={() =>
                navigation.navigate("startWorkout", { workoutID: workoutID })
              }
              style={{ marginLeft: 15, marginTop: 40 }}
            />
          </View>

          <Image style={styles.image} source={imagePath}></Image>
        </View>
      </View>
      <View style={styles.instruction}>
        <Text style={styles.title}>{exerciseSelected.exercise.name}</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.btn}
          accessibilityLabel="Voir les informations sur l'exécution de l'exercice"
          accessibilityHint="Ouvre une modale"
          onPress={openModal}
        >
          <Text style={styles.textButton}>Voir les instructions</Text>
        </TouchableOpacity>
      </View>

      {!noHistory && (
        <View style={styles.perfContainer}>
          <Text style={styles.text}>Performances de tes dernières séances</Text>
          <Underline width={100} />
          <ScrollView
            horizontal={true}
            snapToInterval={screenWidth}
            snapToAlignment="start" // Alignement au début
            pagingEnabled={false} // Désactive pagingEnabled (parfois redondant avec snapToInterval)
            decelerationRate="fast"
            contentContainerStyle={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
            showsHorizontalScrollIndicator={false}
          >
            {exerciseHistoryToShow}
          </ScrollView>
        </View>
      )}
      <View>
        <Text style={styles.text}>Objectifs de la série</Text>
        <Underline width={100} />
        <Text style={styles.serie}>
          Série {currentSet} sur {exerciseSelected.customSets.length}
        </Text>
        <View style={styles.objContainer}>
          {muscleGroup != "Cardio" && (
            <LinearGradient
              colors={["#1C1C45", "#4645AB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.linearObj}
            >
              <Text style={styles.obj}>
                Nombre de répétitons : {exerciseSelected.customSets[0].reps}
              </Text>
            </LinearGradient>
          )}
          <LinearGradient
            colors={["#1C1C45", "#4645AB"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.linearObj}
          >
            <Text style={styles.obj}>
              {muscleGroup != "Cardio"
                ? "Charge :"
                : "Résistance / Inclinaison : "}{" "}
              {exerciseSelected.customSets[0].weight}{" "}
              {muscleGroup != "Cardio" && "kg"}
            </Text>
          </LinearGradient>
          {muscleGroup === "Cardio" && (
            <LinearGradient
              colors={["#1C1C45", "#4645AB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.linearObj}
            >
              <Text style={styles.obj}>
                Durée : {Math.floor(exerciseSelected.rest / 3600)} h{" "}
                {Math.floor((exerciseSelected.rest % 3600) / 60)} min
              </Text>
            </LinearGradient>
          )}
        </View>
      </View>

      <View style={styles.button}>
        <Button
          textButton={
            muscleGroup != "Cardio"
              ? "Valider la série"
              : "Commencer l'exercice"
          }
          textColor="black"
          background="#A3FD01"
          width={300}
          height={60}
          borderColor="none"
          accessibilityLabel="Aller à la page du minuteur"
          onPress={() =>
            navigation.navigate("timer", {
              exerciseID: exerciseID,
              workoutID: workoutID,
            })
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D36",
    paddingHorizontal: 10,
  },

  imageContainer: {
    height: 350,
    width: "100%",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: "white",
    alignItems: "center",
  },

  arrowContainer: {
    width: "100%",
  },

  image: {
    width: 280,
    height: 280,
  },

  title: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },

  btn: {
    width: "40%",
    height: 35,
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 10,
    paddingTop: 6,
    backgroundColor: "transparent",
    borderRadius: 10,
    borderColor: "#A3FD01",
    borderWidth: 1,
  },

  textButton: {
    color: "#A3FD01",
    justifyContent: "center",
    textAlign: "center",
    padding: "auto",
  },

  perfcontainer: {
    marginTop: 5,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
  },

  linearPerf: {
    height: 20,
    width: "40%",
    marginBottom: 10,
    borderRadius: 10,
    marginHorizontal: 5,
  },

  perf: {
    color: "#ffffff",
    textAlign: "center",
    margin: "auto",
  },

  text: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },

  serie: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginTop: 5,
  },

  objContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  obj: {
    color: "#ffffff",
    textAlign: "center",
    margin: "auto",
  },

  linearObj: {
    height: 50,
    width: "60%",
    marginBottom: 10,
    borderRadius: 10,
  },

  button: {
    position: "absolute",
    bottom: 30,
    alignItems: "center",
    width: "100%",
    marginHorizontal: 10,
  },

  modalContainer: {
    width: "80%",
    height: "70%",
    backgroundColor: "#272D34",
    borderRadius: 20,
    padding: 15,
    margin: "auto",
  },

  iconModal: {
    alignItems: "flex-end",
  },

  titleModal: {
    marginTop: 10,
    marginLeft: 15,
  },

  descriptionContainer: {
    backgroundColor: "#D9D9D9",
    justifyContent: "space-between",
    width: "90%",
    height: "70%",
    justifyContent: "flex-start",
    margin: "auto",
    paddingLeft: 5,
    paddingTop: 20,
    borderRadius: 10,
  },
  sentence: {
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  noHistory: {
    color: "red",
    fontWeight: "600",
  },
  perfDate: {
    color: "white",
    width: "100%",
    textAlign: "center",
  },
  perfContainer: {
    height: "135",
  },
  performanceDate: {
    color: "white",
    textAlign: "center",
  },
  perfSection: {
    marginTop: 5,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },
});
