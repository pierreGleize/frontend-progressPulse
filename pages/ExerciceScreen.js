import { StyleSheet, Text, TouchableOpacity, View, ImageBackground, Modal, Image, ScrollView } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Button from "../components/Button";
import Underline from "../components/Underline";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";
import images from "../utils/images";

export default function Exercice({ navigation, route }) {
    const { workoutID, exerciseID } = route.params || {};
    const workouts = useSelector(state => state.workouts.value)
    const workoutSelected = workouts.find(workout => workout._id === workoutID)
    const exerciseSelected = workoutSelected.exercises.find(exercise => exercise._id === exerciseID)
    const imagePath = images[exerciseSelected.exercise.muscleGroupe.toLowerCase()][exerciseSelected.exercise.image]
    
    const descriptionSentences = exerciseSelected.exercise.description.split(/(?<=[.!?])\s+/)
    const descriptionSetencesToShow = descriptionSentences.map((sentence, i )=> {
        return <Text style={styles.sentence} key={i}>► {sentence}</Text>
    })
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
            <View>
                <Text style={styles.text}>Performances de ta dernière séance</Text>
                <Underline width={100} />
                <View style={styles.perfcontainer}>
                    <LinearGradient
                        colors={['#1C1C45', '#4645AB']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.linearPerf}>
                        <Text style={styles.perf}>Série 1 : 10 x 50kg</Text>
                    </LinearGradient>
                    <LinearGradient
                        colors={['#1C1C45', '#4645AB']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.linearPerf}>
                        <Text style={styles.perf}>Série 2 : 10 x 50kg</Text>
                    </LinearGradient>
                    <LinearGradient
                        colors={['#1C1C45', '#4645AB']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.linearPerf}>
                        <Text style={styles.perf}>Série 3 : 10 x 50kg</Text>
                    </LinearGradient>
                    <LinearGradient
                        colors={['#1C1C45', '#4645AB']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.linearPerf}>
                        <Text style={styles.perf}>Série 4 : 10 x 50kg</Text>
                    </LinearGradient>
                </View>
            </View>
            <View>
                <Text style={styles.text}>Objectifs de la série</Text>
                <Underline width={100} />
                <Text style={styles.serie}>Série 1 sur {exerciseSelected.customSets.length}</Text>
                <View style={styles.objContainer}>
                    <LinearGradient
                        colors={['#1C1C45', '#4645AB']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.linearObj}
                    >
                        <Text style={styles.obj}>Nombre de répétitons : {exerciseSelected.customSets[0].reps}</Text>
                    </LinearGradient>
                    <LinearGradient
                        colors={['#1C1C45', '#4645AB']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.linearObj}>
                        <Text style={styles.obj}>Charge : {exerciseSelected.customSets[0].weight} kg</Text>
                    </LinearGradient>
                </View>
            </View>
            <View style={styles.button}>
                <Button
                    textButton="Valider la série"
                    textColor="black"
                    background="#A3FD01"
                    width={300}
                    height={60}
                    borderColor="none"
                    onPress={() => navigation.navigate('timer')} />
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
        justifyContent: 'center',
        alignItems: 'center'
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

    }

});