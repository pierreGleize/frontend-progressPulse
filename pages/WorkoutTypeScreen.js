import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";
import { resetWorkoutCreation } from "../reducers/workoutCreation";

export default function WorkoutTypeScreen({ navigation }) {

  const dispatch = useDispatch()

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <FontAwesome
          name={"chevron-left"}
          accessibilityLabel="Redirection vers la page d'accueil"
          size={24}
          color={"#3BC95F"}
          onPress={() => navigation.navigate("Home")}
          style={{ marginLeft: 15, marginTop: 5 }}
        />
        <View style={styles.infoContainer}>
          <FontAwesome
            name={"info-circle"}
            size={30}
            color={"#A3FD01"}
            style={styles.infoIcon}
            accessibilityLabel="Donne une information pour choisir entre la séance personnalisé ou pré-définie"
          />
          <Text style={styles.textInfo}>
            Crée ta séance en choisissant tes exercices ou sélectionne-en une
            déjà prête rien que pour toi !
          </Text>
        </View>
      </View>
      <View style={styles.btnContainer}>
        <TouchableOpacity
          accessibilityLabel="Créer une séance personalisée"
          accessibilityHint="Vous allez être redirigé vers la page des groupes musculaires"
          activeOpacity={0.7}
          style={styles.btn}
          onPress={() => {
            dispatch(resetWorkoutCreation())
            navigation.navigate("muscleGroup")
          }}
        >
          <LinearGradient
            colors={["#3BC95F", "#1f532c"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradiant}
          >
            <Image
              source={require("../assets/illustrations/seance-perso.webp")}
              style={styles.image}
            />
            <View style={styles.textBtnContainer}>
              <Text style={styles.btnText}>Séance</Text>
              <Text style={styles.btnText}>personalisée</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityLabel="Créer une séance pré-définie"
          accessibilityHint="Vous allez être redirigé vers la page des différents niveau de séance"
          activeOpacity={0.7}
          style={styles.btn}
          onPress={() => navigation.navigate("WorkoutDifficulty")}
        >
          <LinearGradient
            colors={["#3BC95F", "#1f532c"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradiant}
          >
            <Image
              source={require("../assets/illustrations/seance-predef.webp")}
              style={styles.image}
            />
            <View style={styles.textBtnContainer}>
              <Text style={styles.btnText}>Séance</Text>
              <Text style={styles.btnText}>pré-définie</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
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
  topContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    marginRight: 10,
  },
  textInfo: {
    color: "white",
  },
  btnContainer: {
    flex: 4,
    gap: 20,
    justifyContent: "center",
  },
  btn: {
    borderRadius: 20,
    overflow: "hidden",
  },
  gradiant: {
    height: 230,
    width: "100%",
    maxWidth: 500,
    justifyContent: "flex-start",
  },
  image: {
    width: "60%",
    height: "100%",
    resizeMode: "cover",
  },
  textBtnContainer: {
    position: "absolute",
    bottom: 50,
    right: 10,
  },
  btnText: {
    color: "white",
    fontSize: 40,
    fontWeight: 600,
    textAlign: "right",
  },
});
