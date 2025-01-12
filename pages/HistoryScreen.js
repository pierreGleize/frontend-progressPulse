import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useSelector } from "react-redux";
export default function HistoryScreen({ navigation }) {
  const history = useSelector((state) => state.workoutsHistory.value);

  let workoutsName = [];
  for (const name of history) {
    if (!workoutsName.includes(name.workoutName)) {
      workoutsName.unshift(name.workoutName); //Unshift pour ajouter au début du tableau, permet de le trier du plus récent au plus ancien
    }
  }

  const workoutsByName = workoutsName.map((element, i) => (
    <TouchableOpacity
      key={i}
      style={styles.card}
      onPress={() =>
        navigation.navigate("historyWorkout", { workoutName: element })
      }
      activeOpacity={0.7}
      accessibilityLabel={`Permet de voir l'historique de ${element}`}
    >
      <Text style={styles.text}>{element}</Text>
      <FontAwesome
        name={"arrow-right"}
        size={15}
        color={"#3BC95F"}
        style={{ position: "absolute", right: 15, top: 10 }}
        accessibilityLabel={`Permet de voir l'historique de ${element}`}
      />
    </TouchableOpacity>
  ));

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity
          style={styles.backToContainer}
          onPress={() => navigation.navigate("Stats")}
          accessibilityLabel={`Permet de revenir a la page Statistiques`}
          // accessibilityHint="On va se diriger vers la page Statistiques"
        >
          <FontAwesome name={"chevron-left"} size={24} color={"#3BC95F"} />
          <Text style={styles.backToText}>Statisques</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Suivi de séance</Text>
      </View>
      <ScrollView style={styles.weightContainer}>
        {history.length === 0 ? (
          <View style={styles.infoContainer}>
            <FontAwesome
              name={"info-circle"}
              size={30}
              color={"#A3FD01"}
              style={styles.infoIcon}
              // accessibilityLabel={`Donne une information pour avoir l'historique des séances`}
            />
            <Text style={styles.textInfo}>
              Lancez une séance pour commencer votre suivi personnalisé !
            </Text>
          </View>
        ) : (
          <View>
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate("historyWorkout", {
                  workoutName: "Toutes les séances",
                })
              }
              activeOpacity={0.7}
              accessibilityLabel={`Permet de voir l'historique de toutes les séances`}
              accessibilityHint="On va arriver sur la page de l'historique de toutes les séances"
            >
              <Text style={styles.text}>Toutes les séances</Text>
              <FontAwesome
                name={"arrow-right"}
                size={15}
                color={"#3BC95F"}
                style={{ position: "absolute", right: 15, top: 10 }}
                accessibilityLabel={`Permet de voir l'historique de toute les séances`}
              />
            </TouchableOpacity>
            {workoutsByName}
          </View>
        )}
      </ScrollView>
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
  topContainer: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: "white",
    marginBottom: 25,
  },
  backToContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    left: 0,
    bottom: 10,
  },
  backToText: {
    color: "#3BC95F",
    marginLeft: 8,
  },
  topTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: 600,
  },
  weightContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 15,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  infoIcon: {
    marginRight: 10,
  },
  textInfo: {
    color: "white",
  },
  card: {
    padding: 10,
    marginBottom: 15,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
    borderBottomWidth: 1,
  },
  text: {
    color: "white",
    fontSize: 16,
    marginBottom: 5,
  },
});
