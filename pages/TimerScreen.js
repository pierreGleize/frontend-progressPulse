import { View, Text, StyleSheet } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function TimerScreen({ navigation }) {

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <FontAwesome
                    name={"chevron-left"}
                    size={24}
                    color={"#3BC95F"}
                    onPress={() => navigation.navigate("exercice")}
                    style={{ marginLeft: 15, marginTop: 40 }}
                />
            </View>
            <Text style={styles.title}>TimerScreen</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D0D36',
        justifyContent: 'center',
        alignItems: 'center',
    },

    topContainer: {
        flex: 1,
        justifyContent: "space-between",
    },

    title: {
        fontSize: 32,
        color: "white",
        fontWeight: 600,
    },
})