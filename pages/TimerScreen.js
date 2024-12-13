import { View, Text, StyleSheet, TextInput, Platform, KeyboardAvoidingView, TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Underline from "../components/Underline";
import Button from "../components/Button";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { TimerPickerModal } from "react-native-timer-picker";
import { useDispatch, useSelector } from "react-redux";
import { addExerciseSet } from "../reducers/currentWorkout";
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'

export default function TimerScreen({ navigation, route }) {
    const { workoutID, exerciseID } = route.params || {};

    const dispatch = useDispatch()
  
    const [reps, setReps] = useState('')
    const [weight, setWeight] = useState('')
    const [emptyFields, setEmptyFields] = useState(false);
    const [input, setInput] = useState(false)
    const [showPicker, setShowPicker] = useState(false);

    // Récupération des données de la séance en cours
    const currentWorkout = useSelector(state => state.currentWorkout.value)
    // Récupération de l'exercice en cours
    const currentExercise = currentWorkout.performances.find(e => e.exercise === exerciseID)

    // Récupération de la séance en cours
    const workouts = useSelector(state => state.workouts.value)
    const workoutSelected = workouts.find(workout => workout._id === workoutID)
    // Récupération de l'exercice sélectionné dans la séance
    const exerciseSelected = workoutSelected.exercises.find(exercise => exercise._id === exerciseID)
    // Récupération du nombre de série à faire
    const nbSets = exerciseSelected.customSets.length
 
    const [minutes, setMinutes] = useState('2');
    const [secondes, setSecondes] = useState('00')
    const [isPlaying, setIsPlaying] = useState(false)
    const [isTimerVisible, setIsTimerVisible] = useState(false);

    //Retourne le tableau 'timeMinuteParts', qui contiendra la valeur des minutes formatée
    const formatMinuteTime = ({ minutes }) => {
        const timeMinuteParts = [];
        if (minutes !== undefined) {
            timeMinuteParts.push(minutes.toString().padStart(2, "0"));
        }
        return timeMinuteParts
    };

    //Retourne le tableau 'timeMinuteParts', qui contiendra la valeur des secondes formatée
    const formatSecondTime = ({ seconds }) => {
        const timeSecondParts = [];
        if (seconds !== undefined) {
            //seconds.toString : convertit la variable seconds en une chaîne de caractères
            //.padStart(2, "0") : ajoute des zéros au début de la chaîne 
            timeSecondParts.push(seconds.toString().padStart(2, "0"));
        }
        return timeSecondParts
    }

    //Permet de lancer et de rendre visible le minuteur
    const timerClick = () => {
        setIsPlaying(true)
        setIsTimerVisible(true)
    }

    //Converti les minutes et les secondes formaté en nombre de secondes
    let time = ((minutes * 60) + parseFloat(secondes));

    //Vérifie si les input sont bien remplis et sauvegarde les données rentrées
    const addSet = () => {
        if (!reps || !weight) {
            setEmptyFields(true)
            setInput(false)
        } else {
            setEmptyFields(false)
            setInput(true)
        }
    }

    const validateSet = () => {
        const restToAdd = 90
        const setToAdd = {
            exerciseID: exerciseID,
            weight: parseInt(weight),
            reps: parseInt(reps),
            rest : restToAdd
        }
        dispatch(addExerciseSet(setToAdd))
        if (currentExercise){
            if(currentExercise.sets.length + 1 < nbSets){
                navigation.navigate('exercice', {exerciseID: exerciseID, workoutID: workoutID})
            } else {
                navigation.navigate("startWorkout", {workoutID: workoutID})
            }
        } else {
            navigation.navigate('exercice', {exerciseID: exerciseID, workoutID: workoutID})
        }
          
    }

    const updateSet = () => {
        setInput(false)
    }

    //Si le minuteur se termine et que les input sont pas remplis, envoi un message d'erreur et reste sur la page 
    const changeScreen = () => {
        if (input) {
            navigation.navigate('TabNavigator')
        } else {
            setEmptyFields(true)
        }
    }



    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.topContainer}>
                <Text style={styles.title}>Temps de repos</Text>
                <Underline width={80} />
            </View>
            {emptyFields && (
                <View >
                    <Text style={styles.errorMessage}>
                        Veuillez remplir tous les champs de saisie pour passer à la série suivante
                    </Text>
                </View>
            )}
            {!isTimerVisible &&
                <View>
                    <TouchableOpacity style={styles.timer} onPress={() => setShowPicker(true)}>
                        <Text style={styles.textTimer}>{minutes}:{secondes}</Text>
                    </TouchableOpacity>
                    <View style={styles.btn}>
                        <Button
                            textButton="Démarrer le minuteur"
                            textColor="black"
                            width="70%"
                            height={50}
                            background="#A3FD01"
                            onPress={timerClick}
                        />
                    </View>
                    {/* Modal permettant de changer son temps de repos */}
                    <TimerPickerModal
                        visible={showPicker}
                        setIsVisible={setShowPicker}
                        onConfirm={(pickedDuration) => {
                            setMinutes(formatMinuteTime(pickedDuration));
                            setSecondes(formatSecondTime(pickedDuration));
                            setShowPicker(false);
                        }}
                        modalTitle="Rest"
                        onCancel={() => setShowPicker(false)}
                        closeOnOverlayPress
                        hideHours
                        /*          Audio={Audio},od
                                    LinearGradient={LinearGradient}
                                    Haptics={Haptics} */
                        styles={{
                            theme: "dark",
                        }}
                        modalProps={{
                            overlayOpacity: 0.4,
                        }}
                    />
                </View>}
            {isTimerVisible &&
                <View>
                    <View style={styles.count}>
                        {/* Minuteur */}
                        <CountdownCircleTimer
                            isPlaying={isPlaying}
                            duration={time}
                            colors={["#A3FD01", "#850606", "#850606", "#850606", "#850606"]}
                            colorsTime={[5, 3, 2, 1, 0]}
                            onComplete={changeScreen}
                            updateInterval={1}
                        >
                            {({ remainingTime, color }) => (
                                <View>
                                    <Text style={{ color: '#ffffff', fontSize: 18, textAlign: 'center' }}>Next set in</Text>
                                    <Text style={{ color, fontSize: 40, textAlign: 'center' }}>
                                        {remainingTime}
                                    </Text>
                                    <Text style={{ color: '#ffffff', fontSize: 18, textAlign: 'center' }}>seconds</Text>
                                </View>
                            )}
                        </CountdownCircleTimer>
                    </View>
                    <View style={styles.btnInput}>
                        <Button
                            textButton="Passer à la série suivante"
                            textColor="black"
                            width="70%"
                            height={50}
                            background="#A3FD01"
                            onPress={() => navigation.navigate('TabNavigator')}
                        />
                    </View>
                </View>
            }
            <View>
                {!input && (
                    <LinearGradient
                        style={styles.linear}
                        colors={['#4645AB', '#1C1C45']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 0 }}>
                        <View style={styles.data}>
                            <Text style={styles.text}>Nombre de répétitions effectuées : </Text>
                            <Underline width={60} />
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Nombre de répétitions"
                                keyboardType="numeric"
                                onChangeText={value => setReps(value)}
                                value={reps}
                            />
                        </View>
                        <View style={styles.data}>
                            <Text style={styles.text}>Charge de l'exercice :</Text>
                            <Underline width={60} />
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Charge"
                                keyboardType="numeric"
                                onChangeText={value => setWeight(value)}
                                value={weight}
                            />
                        </View>
                        {emptyFields && (
                            <Text style={styles.errorMessage}>
                                Veuillez remplir tous les champs
                            </Text>
                        )}
                        <View style={styles.btnContainer}>
                            <Button
                                textButton="Valider la saisie"
                                textColor="black"
                                width="60%"
                                height={50}
                                background="#A3FD01"
                                onPress={addSet} />
                        </View>
                    </LinearGradient>)}
                {input && (<View>
                    <LinearGradient
                        style={styles.linearInput}
                        colors={['#4645AB', '#1C1C45']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 0 }}>
                        <View style={styles.pencil}>
                            <FontAwesome name={"pencil"} size={20} color={"#3BC95F"} onPress={updateSet} />
                        </View>
                        <View style={styles.dataInput}>
                            <Text style={styles.textTitle}>Nombre de répétitions effectuées : </Text>
                            <Underline width={60} />
                        </View>
                        <Text style={styles.textInput}>{reps}</Text>
                        <View style={styles.dataInput}>
                            <Text style={styles.textTitle}>Charge de l'exercice :</Text>
                            <Underline width={60} />
                        </View>
                        <Text style={styles.textInput} >{weight}</Text>
                    </LinearGradient>
                </View>)}
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D0D36',
    },

    topContainer: {
        marginTop: 50,
        marginLeft: 30,
        justifyContent: "space-between",
    },

    title: {
        fontSize: 32,
        color: "white",
        fontWeight: 'bold',
    },

    timer: {
        width: '60%',
        height: '25%',
        backgroundColor: '#D9D9D9',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 30,
    },

    count: {
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },

    textTimer: {
        fontSize: 60,
        fontWeight: 'bold'
    },

    btnContainer: {
        alignItems: 'center'
    },

    btn: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },

    linear: {
        height: 350,
        width: '80%',
        justifyContent: 'center',
        margin: 'auto',
        borderRadius: 10,
    },

    data: {
        paddingTop: 15,
        marginLeft: 20
    },

    text: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold'
    },

    inputContainer: {
        alignItems: 'center'
    },

    input: {
        width: '70%',
        height: 50,
        backgroundColor: '#D9D9D9',
        borderRadius: 10,
        padding: 10,
        margin: 10,
    },

    errorMessage: {
        color: "red",
        textAlign: "center",
    },

    linearInput: {
        height: 200,
        width: '80%',
        justifyContent: 'flex-start',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 80,
        borderRadius: 10,
    },

    pencil: {
        alignItems: 'flex-end',
        marginTop: 10,
        marginRight: 15,
    },

    dataInput: {
        paddingTop: 15,
        marginLeft: 20
    },

    textTitle: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },

    textInput: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center'
    },

    btnInput: {
        justifyContent: 'center',
        alignItems: 'center',
    },
})