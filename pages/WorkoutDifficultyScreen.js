import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Underline from "../components/Underline";
import { LinearGradient } from "expo-linear-gradient";

export default function WorkoutDifficultyScreen({ navigation }) {
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
          <Text style={styles.textInfo}>Indique ton niveau pour commencer</Text>
        </View>
      </View>
      <View style={styles.btnContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.btn}
          onPress={() =>
            navigation.navigate("workoutChoice", { categorie: "Débutant" })
          }
        >
          <LinearGradient
            colors={["#3BC95F", "#1D632F"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradiant}
          >
            <Image
              source={require("../assets/illustrations/debutant.webp")}
              style={styles.image}
            />
            <View style={styles.textBtnContainer}>
              {/* <Text style={styles.btnText}>Séance</Text> */}
              <Text style={styles.btnText}>Débutant</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.btn}
          onPress={() =>
            navigation.navigate("workoutChoice", { categorie: "Intermédiaire" })
          }
        >
          <LinearGradient
            colors={["#3BC95F", "#1D632F"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradiant}
          >
            <Image
              source={require("../assets/illustrations/intermediaire.webp")}
              style={styles.smallImage}
            />
            <View style={styles.textBtnContainer}>
              {/* <Text style={styles.btnText}>Séance</Text> */}
              <Text style={styles.btnText}>Intermédiaire</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.btn}
          onPress={() =>
            navigation.navigate("workoutChoice", { categorie: "Confirmé" })
          }
        >
          <LinearGradient
            colors={["#3BC95F", "#1D632F"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradiant}
          >
            <Image
              source={require("../assets/illustrations/confirme.webp")}
              style={styles.smallImage}
            />
            <View style={styles.textBtnContainer}>
              {/* <Text style={styles.btnText}>Séance</Text> */}
              <Text style={styles.btnText}>Confirmé</Text>
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
  title: {
    fontSize: 32,
    color: "white",
    fontWeight: 600,
  },
  btnContainer: {
    flex: 3,
    alignItems: "center",
    justifyContent: "space-around",
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
  btn: {
    borderRadius: 20,
    overflow: "hidden",
    maxWidth: 350,
    width: "80%",
  },
  gradiant: {
    height: 150,
    width: "100%",
    maxWidth: 500,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  image: {
    width: "40%",
    height: "90%",
    resizeMode: "cover",
    marginLeft: 10,
  },
  smallImage: {
    width: "40%",
    height: "100%",
    resizeMode: "cover",
    marginLeft: 10,
  },
  textBtnContainer: {
    position: "absolute",
    bottom: 30,
    right: 10,
  },
  btnText: {
    color: "white",
    fontSize: 30,
    fontWeight: 600,
    textAlign: "right",
  },
});
