import { StyleSheet, Text, TextInput, View, TouchableWithoutFeedback, Keyboard } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Underline from "../components/Underline";
import Button from "../components/Button";
import { useState } from "react";


export default function WorkoutEndingScreen({ navigation }) {

    const [personnalNote, setPersonnalNote] = useState(0)
    const [ressenti, setRessenti] = useState('')

    const note = []
    for (let star = 0; star < 5; star++) {
        let color = '#ffffff'
        if (star < personnalNote) {
            color = '#A3FD01'
        }
        note.push(<FontAwesome key={star} name={'star-o'} color={color} onPress={() => setPersonnalNote(star + 1)} size={50} style={{ marginRight: 25 }} />)
    }

    return (
      /*   <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}/> */
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <Text style={styles.title}>Séance terminée !</Text>
                <Underline width={80} />
            </View>
            <View style={styles.note}>
                <Text style={styles.text}>Comment s'est passsé ta séance ? </Text>
                <View style={styles.star}>
                    {note}
                </View>
            </View>
            <View style={styles.bottomContainer}>
                <TextInput
                    editable
                    placeholder="Saisie ton ressenti sur la séance"
                    multiline
                    numberOfLines={10}
                    maxLength={200}
                    style={styles.input}
                    onChangeText={value => setRessenti(value)}
                    value={ressenti}
                />
                <Button
                    textButton="Enregistrer ma séance"
                    textColor="black"
                    width="70%"
                    height={50}
                    background="#A3FD01"
                    onPress={() => navigation.navigate('TabNavigator')} />
            </View>
        </View>
 /*        </TouchableWithoutFeedback> */
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
        marginBottom: 30,
    },

    title: {
        fontSize: 24,
        color: "white",
        fontWeight: 600,
    },

    note: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        marginBottom: 30,
    },

    text: {
        color: '#FFFFFF',
        fontSize: 18,
    },

    star: {
        flexDirection: 'row',
        marginTop: 30,
        marginLeft: 10,
    },

    input: {
        width: '70%',
        height: 400,
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 10,
        margin: 10,
        textAlignVertical: 'top'
    },

    bottomContainer: {
        justifyContent: 'center',
        alignItems: 'center',

    },
})