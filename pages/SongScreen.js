import { StyleSheet, Text, View, TouchableOpacity,ActivityIndicator, } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Audio } from "expo-av";
import sounds from "../utils/sounds";
import { useState, useEffect } from "react";
import { changeSound } from "../reducers/user";
import { useDispatch, useSelector } from "react-redux";

export default function SongScreen({ navigation, route }) {
  const [soundChoice, setSoundChoice] = useState("");
  const [currentSound, setCurrentSound] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

  useEffect(() => {
    setSoundChoice(user.sound);
  }, []);

  // Modifier le son dans la BDD collection users et enregistrer les changements dans le reducer user
  const validateSoundAndNavigate = () => {
    if (currentSound) {
      stopSound();
    }
    setIsLoading(true)
    fetch(`${process.env.EXPO_PUBLIC_SERVER_IP}/users/changeSound`, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ token: user.token, newSound: soundChoice }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result === false) {
          setSoundChoice("");
          navigation.navigate("Settings");
          setIsLoading(false)
        } else {
          dispatch(changeSound(data.soundUpdated));
          setSoundChoice("");
          navigation.navigate("Settings");
          setIsLoading(false)
        }
      });
  };

  // Permet d'enregistrer un son dans un état pour qu'il soit sauvegardé, joué et ajouter un icon 'check' avec du conditionning dans le JSX
  const handleChangeSound = (soundName) => {
    if (!soundName) {
      return;
    }
    setSoundChoice(soundName);
    playSound(soundName);
  };

  // Jouer un son
  async function playSound(soundName) {
    if (currentSound) {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
    }
    const { sound } = await Audio.Sound.createAsync(sounds[soundName]);
    setCurrentSound(sound);
    await sound.playAsync();
  }

  // Stopper un son
  async function stopSound() {
    if (currentSound) {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity
          style={styles.backToContainer}
          onPress={validateSoundAndNavigate}
          accessibilityLabel="Permet de retourner sur la page Réglages"
          accessibilityHint="Vous allez être redirigé vers la page Réglages"
        >
          <FontAwesome name={"chevron-left"} size={24} color={"#3BC95F"} />
          <Text style={styles.backToText}>Réglages</Text>
        </TouchableOpacity>

        <Text style={styles.topTitle}>Son</Text>
      </View>
      <View style={styles.settingWrapper}>
        <View style={styles.settingContainer}>
          <View style={styles.songWrapper}>
            <TouchableOpacity
              style={styles.songContainer}
              activeOpacity={0.7}
              onPress={() => handleChangeSound("Alarm")}
              accessibilityLabel="Sonnerie Alarm"
              accessibilityHint="Vous avez choisi Alarm comme sonnerie"
            >
              <Text style={styles.text}>Alarm</Text>
              {soundChoice === "Alarm" && (
                <FontAwesome
                  name={"check"}
                  size={20}
                  color={"#A3FD01"}
                  style={styles.infoIcon}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.songContainer}
              activeOpacity={0.7}
              onPress={() => handleChangeSound("Ring")}
              accessibilityLabel="Sonnerie Ring"
              accessibilityHint="Vous avez choisi Ring comme sonnerie"
            >
              <Text style={styles.text}>Ring</Text>
              {soundChoice === "Ring" && (
                <FontAwesome
                  name={"check"}
                  size={20}
                  color={"#A3FD01"}
                  style={styles.infoIcon}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.songContainer}
              activeOpacity={0.7}
              onPress={() => handleChangeSound("Notification")}
              accessibilityLabel="Sonnerie Notification"
              accessibilityHint="Vous avez choisi Notification comme sonnerie"
            >
              <Text style={styles.text}>Notification</Text>
              {soundChoice === "Notification" && (
                <FontAwesome
                  name={"check"}
                  size={20}
                  color={"#A3FD01"}
                  style={styles.infoIcon}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.songContainer}
              activeOpacity={0.7}
              onPress={() => handleChangeSound("Ring de boxe")}
              accessibilityLabel="Sonnerie Ring de Boxe"
              accessibilityHint="Vous avez choisi Ring de Boxe comme sonnerie"
            >
              <Text style={styles.text}>Ring de boxe</Text>
              {soundChoice === "Ring de boxe" && (
                <FontAwesome
                  name={"check"}
                  size={20}
                  color={"#A3FD01"}
                  style={styles.infoIcon}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.songContainer}
              activeOpacity={0.7}
              onPress={() => handleChangeSound("Féerique")}
              accessibilityLabel="Sonnerie Féerique"
              accessibilityHint="Vous avez choisi Féerique comme sonnerie"
            >
              <Text style={styles.text}>Féerique</Text>
              {soundChoice === "Féerique" && (
                <FontAwesome
                  name={"check"}
                  size={20}
                  color={"#A3FD01"}
                  style={styles.infoIcon}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.songContainer}
              activeOpacity={0.7}
              onPress={() => handleChangeSound("Silencieux")}
              accessibilityLabel="Sonnerie Silencieux"
              accessibilityHint="Vous avez choisi Silencieux comme sonnerie"
            >
              <Text style={styles.text}>Silencieux</Text>
              {soundChoice === "Silencieux" && (
                <FontAwesome
                  name={"check"}
                  size={20}
                  color={"#A3FD01"}
                  style={styles.infoIcon}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <FontAwesome
          name={"info-circle"}
          size={30}
          color={"#A3FD01"}
          style={styles.infoIcon}
          accessibilityLabel="Affiche une information pour choisir la sonnerie de minuteur"
        />
        <Text style={styles.textInfo}>
          Choisis la sonnerie que tu souhaites entendre à la fin de chaque
          exercice
        </Text>
      </View>
      {isLoading && (
              <View style={styles.backgroundLoading}>
                <ActivityIndicator size="large" color="#A3FD01" animating={true} />
              </View>
            )}
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
    marginBottom: 30,
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
  settingWrapper: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  settingContainer: {
    width: "100%",
    maxWidth: 500,
    height: 270,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  songWrapper: {
    width: "90%",
    height: "90%",
  },
  songContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
    borderBottomWidth: 1,
    height: 40,
  },
  text: {
    color: "white",
    fontSize: 14,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    // marginVertical: 20,
    margin: 20,
    justifyContent: "center",
  },
  infoIcon: {
    marginRight: 10,
  },
  textInfo: {
    color: "white",
  },
  backgroundLoading: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
});
