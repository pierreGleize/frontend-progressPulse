import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Underline from "../components/Underline";
import { LinearGradient } from "expo-linear-gradient";

export default function WorkoutDifficultyScreen({ navigation }) {
  const difficulty = [
    {
      name: "Debutant",
      source: require("../assets/illustrations/debutant.webp"),
      id: 1,
    },
    {
      name: "Intermediaire",
      source: require("../assets/illustrations/intermediaire.webp"),
      id: 2,
    },
    {
      name: "Confirmé",
      source: require("../assets/illustrations/confirme.webp"),
      id: 3,
    },
  ];

  const handleNavigateToWorkout = (name) => {
    navigation.navigate("workoutChoice", { name: name });
  };

  const button = difficulty.map((data) => {
    return (
      <TouchableOpacity
        key={data.id}
        activeOpacity={0.7}
        style={styles.btn}
        onPress={() => handleNavigateToWorkout(data.name)}
      >
        <LinearGradient
          colors={["#3BC95F", "#1f532c"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradiant}
        >
          <Image source={data.source} style={styles.image} />
          <Text style={styles.btnText}>{data.name}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  });

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <FontAwesome
          name={"chevron-left"}
          size={24}
          color={"#3BC95F"}
          style={{ marginLeft: 15, marginTop: 5 }}
          onPress={() => navigation.navigate("WorkoutType")}
        />
        <View>
          <Text style={styles.title}>Niveau de la séance</Text>
          <Underline width={80} />
        </View>
        <View style={styles.infoContainer}>
          <FontAwesome
            name={"info-circle"}
            size={30}
            color={"#A3FD01"}
            style={styles.infoIcon}
          />
          <Text style={styles.textInfo}>
            Indique ton niveau pour commencer !
          </Text>
        </View>
      </View>
      <View style={styles.btnContainer}>{button}</View>
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
  title: {
    marginTop: 20,
    fontSize: 28,
    color: "white",
    fontWeight: 600,
  },

  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  infoIcon: {
    marginRight: 10,
  },

  textInfo: {
    color: "white",
  },

  btnContainer: {
    flex: 1,
    gap: 20,
    justifyContent: "center",
  },

  text: {
    fontSize: 50,
    padding: 50,
    textAlign: "center",
    color: "white",
  },

  btn: {
    fontSize: 40,
    borderRadius: 10,
    backgroundColor: "#3BC95F",
    margin: 20,
    borderRadius: 20,
  },

  btnText: {
    fontSize: 30,
    fontWeight: 600,
    top: 40,
    right: 10,
    position: "absolute",
    color: "white",
    textAlign: "right",
  },

  image: {
    width: "35%",
    height: "100%",
    resizeMode: "cover",
    marginLeft: 10,
  },

  gradiant: {
    height: 120,
    width: "100%",
    maxWidth: 500,
    borderRadius: 20,
    justifyContent: "flex-start",
  },
});
