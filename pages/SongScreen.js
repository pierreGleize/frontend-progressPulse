import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Audio } from "expo-av";
import sounds from "../utils/sounds";
import { useState, useEffect } from "react";
import { changeSound } from "../reducers/user";
import { useDispatch, useSelector } from "react-redux";

export default function SongScreen({ navigation, route }) {
  const [soundChoice, setSoundChoice] = useState("");
  const [currentSound, setCurrentSound] = useState(null);

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
        } else {
          dispatch(changeSound(data.soundUpdated));
          setSoundChoice("");
          navigation.navigate("Settings");
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
        />
        <Text style={styles.textInfo}>
          Choisis la sonnerie que tu souhaites entendre à la fin de chaque
          exercice
        </Text>
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
});
