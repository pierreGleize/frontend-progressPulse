import { StyleSheet, Text, TouchableOpacity, View, ImageBackground, Modal, Image, ScrollView } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Button from "../components/Button";
import Underline from "../components/Underline";
import { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";
import images from "../utils/images";

export default function Exercice({ navigation, route }) {
    const { workoutID, exerciseID } = route.params || {};

    // Récupération des l'ensemble des séance
    const workouts = useSelector(state => state.workouts.value)
    // Recherche de la séance avec le workoutID reçu en props
    const workoutSelected = workouts.find(workout => workout._id === workoutID)
    // Recherche de l'exercice avec l'exerciseID reçu en props
    const exerciseSelected = workoutSelected.exercises.find(exercise => exercise.exercise._id === exerciseID)
    // Stockage du nom du groupe musculaire de l'exercice sélectionné
    const muscleGroup = exerciseSelected.exercise.muscleGroupe
    // Recherche de l'image correspondant à l'exercice
    const imagePath = images[exerciseSelected.exercise.muscleGroupe.toLowerCase()][exerciseSelected.exercise.image]
    // Transformation du paragraphe de descripiton en tableau
    const descriptionSentences = exerciseSelected.exercise.description.split(/(?<=[.!?])\s+/)
    const descriptionSetencesToShow = descriptionSentences.map((sentence, i )=> {
        return <Text style={styles.sentence} key={i}>{i+1} - {sentence}</Text>
    })

    const [currentSet, setCurrentSet] = useState(1)
    const [noHistory, setNoHistory] = useState(false)


    // Récupération des performances de la séance en cours
    const currentWorkout = useSelector(state => state.currentWorkout.value)
    // Vérification si l'exercice est présent dans le reducers et combien de sets ont été enregistrés
    useEffect(() => {
        const exerciseExist = currentWorkout.performances.find(e => e.exercise === exerciseID)
        if (exerciseExist){
            setCurrentSet(exerciseExist.sets.length + 1)
        }
    },[currentWorkout])

    // Récupération de l'historique de performance pour cette séance et cet exercice
    const workoutsHistory = useSelector(state => state.workoutsHistory.value)
    const currentWorkoutHistory = workoutsHistory.filter(workout => workout.workoutID === workoutID)
    let mostRecentWorkout = null
    let mostRecentExercise = null
    let mostRecentSets = []
    if(currentWorkoutHistory.length > 0){
        mostRecentWorkout = currentWorkoutHistory.reduce((latest, current) => {
            return new Date(current.date) > new Date(latest.date) ? current : latest;
          });
        mostRecentExercise = mostRecentWorkout.performances.find(e => e.exercise === exerciseID)
        if (mostRecentExercise){
            mostRecentSets = mostRecentExercise.sets
        }
    }
    

    const mostRecentSetsToShow = mostRecentSets.map((set, i) => {
        return (
            <LinearGradient
                key={i}
                colors={['#1C1C45', '#4645AB']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.linearPerf}>
                <Text style={styles.perf}>Série {i+1} : {set.reps} x {set.weight}kg</Text>
            </LinearGradient>
            )
        })
   
    useEffect(() => {
        if(mostRecentSetsToShow.length === 0){
            setNoHistory(true)
        }else {
            setNoHistory(false)
        }
    },[mostRecentSetsToShow])
    
    const [modalVisible, setModalVisible] = useState(false)

    const openModal = () => {
        setModalVisible(true)
    }

    const closeModal = () => {
        setModalVisible(false)
    }

    return (
        <View style={styles.container}>
            <Modal animationType="fade"
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.iconModal}>
                        <FontAwesome
                            name={"times"}
                            size={30}
                            color={"white"}
                            onPress={closeModal}
                            style={styles.infoIcon}
                        />
                    </View>
                    <View style={styles.titleModal}>
                        <Text style={styles.text}>{exerciseSelected.exercise.name}</Text>
                        <Underline width={80} />
                    </View>
                    <View style={styles.descriptionContainer}>
                        <ScrollView>
                            {descriptionSetencesToShow}
                        </ScrollView>
                    </View>
                    <TouchableOpacity activeOpacity={0.7} style={styles.btn} onPress={closeModal}>
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
                        onPress={() => navigation.navigate("startWorkout", {workoutID: workoutID})}
                        style={{ marginLeft: 15, marginTop: 40 }}
                        />
                    </View>
                    
                    <Image style={styles.image} source={imagePath}></Image>
                </View>
            </View>
            <View style={styles.instruction}>
                <Text style={styles.title}>{exerciseSelected.exercise.name}</Text>
                <TouchableOpacity activeOpacity={0.7} style={styles.btn} onPress={openModal}>
                    <Text style={styles.textButton}>Voir les instructions</Text>
                </TouchableOpacity>
            </View>
            
            {!noHistory &&
            
            <View style={styles.perfContainer}>
                <Text style={styles.text}>Performances de ta dernière séance</Text>
                <Underline width={100} />
                <ScrollView>
                <View style={styles.perfcontainer}>
                    {noHistory && <Text style={styles.noHistory}>Pas encore de performances enregistrées</Text>}
                    
                    {mostRecentSetsToShow}
                    
                </View>
                </ScrollView>
            </View>
            
            }
            <View>
                <Text style={styles.text}>Objectifs de la série</Text>
                <Underline width={100} />
                <Text style={styles.serie}>Série {currentSet} sur {exerciseSelected.customSets.length}</Text>
                <View style={styles.objContainer}>
                    {muscleGroup != "Cardio" && <LinearGradient
                        colors={['#1C1C45', '#4645AB']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.linearObj}
                    >
                        <Text style={styles.obj}>Nombre de répétitons : {exerciseSelected.customSets[0].reps}</Text>
                    </LinearGradient>}
                    <LinearGradient
                        colors={['#1C1C45', '#4645AB']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.linearObj}>
                        <Text style={styles.obj}>{muscleGroup != "Cardio" ? "Charge :" : "Résistance / Inclinaison : "} {exerciseSelected.customSets[0].weight} {muscleGroup != "Cardio" && "kg"}</Text>
                    </LinearGradient>
                    {muscleGroup === "Cardio" && <LinearGradient
                        colors={['#1C1C45', '#4645AB']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.linearObj}
                    >
                        <Text style={styles.obj}>Durée : {Math.floor(exerciseSelected.rest / 3600)} h {Math.floor((exerciseSelected.rest % 3600) / 60)} min</Text>
                    </LinearGradient>}
                </View>
            </View>
            
            <View style={styles.button}>
                <Button
                    textButton={muscleGroup != "Cardio" ? "Valider la série" : "Commencer l'exercice"}
                    textColor="black"
                    background="#A3FD01"
                    width={300}
                    height={60}
                    borderColor="none"
                    onPress={() => navigation.navigate('timer', {exerciseID: exerciseID, workoutID: workoutID})} />
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
        alignItems: "center"
    },

    arrowContainer: {
        width: '100%',
        
    },

    image: {
        width: 280,
        height: 280

    },

    title: {
        marginTop: 10,
        marginBottom: 10,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: "white",
    },

    btn: {
        width: '40%',
        height: 35,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 10,
        paddingTop: 6,
        backgroundColor: 'transparent',
        borderRadius: 10,
        borderColor: '#A3FD01',
        borderWidth: 1,
    },

    textButton: {
        color: '#A3FD01',
        justifyContent: "center",
        textAlign: 'center',
        padding: 'auto'
    },

    perfcontainer: {
        marginTop: 5,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'center',
    },

    linearPerf: {
        height: 20,
        width: '40%',
        marginBottom: 10,
        borderRadius: 10,
    },

    perf: {
        color: '#ffffff',
        textAlign: 'center',
        margin: 'auto'
    },

    text: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white'
    },

    serie: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginTop: 5,
    },

    objContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },

    obj: {
        color: '#ffffff',
        textAlign: 'center',
        margin: 'auto'
    },

    linearObj: {
        height: 50,
        width: '60%',
        marginBottom: 10,
        borderRadius: 10,
    },

    button: {
        position: "absolute",
        bottom: 30,
        alignItems: "center",
        width: "100%",
        marginHorizontal: 10
    },

    modalContainer: {
        width: "80%",
        height: "70%",
        backgroundColor: '#272D34',
        borderRadius: 20,
        padding: 15,
        margin: 'auto',
        
    },

    iconModal: {
        alignItems: 'flex-end'
    },

    titleModal: {
        marginTop: 10,
        marginLeft: 15,
    },

    descriptionContainer: {
        backgroundColor: '#D9D9D9',
        justifyContent: 'space-between',
        width: '90%',
        height: '70%',
        justifyContent: "flex-start",
        margin: 'auto',
        paddingLeft: 5,
        paddingTop: 20,
        borderRadius: 10,
    },
    sentence : {
        paddingHorizontal: 10,
        marginBottom : 15

    },
    noHistory:{
        color: "red",
        fontWeight: "600"
    },
    perfDate: {
        color: "white",
        width: "100%",
        textAlign: "center"
    },
    perfContainer: {
        height: "135"
    }

});