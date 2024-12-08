import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function WorkoutSummaryScreen({ navigation, route }) {
  const { backTo } = route.params;
  return (
    <View style={styles.container}>
      <FontAwesome
        name={"chevron-left"}
        size={30}
        color={"#3BC95F"}
        onPress={() => navigation.navigate(backTo)}
      />
      <Text style={styles.text}>WorkoutSummary Screen</Text>
      <Text>Je viens de la page {backTo}</Text>
      <View style={styles.cards}>
        <Text style={styles.cardsTitle}>Squat</Text>
      </View>
      <View style={styles.cards}>
        <Text style={styles.cardsTitle}>Bench</Text>
      </View>
      <View style={styles.cards}>
        <Text style={styles.cardsTitle}>Curl</Text>
      </View>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.btnText}>
          {backTo === "Home" ? "Commencer ma séance" : "Valider ma séance"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "brown",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 40,
    padding: 50,
    textAlign: "center",
    color: "white",
  },
  btn: {
    fontSize: 40,
    borderRadius: 10,
    backgroundColor: "black",
  },
  btnText: {
    fontSize: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    textAlign: "center",
    color: "white",
  },
  cards: {
    width: 300,
    height: 100,
    backgroundColor: "#4645AB",
    margin: 10,
    alignItems: "center",
  },
  cardsTitle: {
    color: "white",
    margin: -10,
  },
});
