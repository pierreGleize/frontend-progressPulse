import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Dimensions,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import Underline from "../components/Underline";
import Button from "../components/Button";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addWeight } from "../reducers/user";
import moment from "moment";

export default function StatsScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [weight, setWeight] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);
  const chartRef = useRef(null);
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

  const dataLimite = user.weight.slice(0, 10);
  const weights = dataLimite.map((element) => {
    return [element.weight];
  });

  const labels = dataLimite.map((element) => {
    element.date.slice(0, 10);
    return [moment(element.date).format("DD-MM")];
  });

  const changeWeight = () => {
    if (!weight) {
      setError(true);
      setErrorMessage("Veuillez remplir correctement le champ de saisie");
      return;
    }
    fetch(`${process.env.EXPO_PUBLIC_SERVER_IP}/users/addWeight`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ weight, token: user.token }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result === false) {
          setError(true);
          setErrorMessage(data.error);
        } else {
          dispatch(addWeight(data.newWeight));
          closeModal();
        }
      });
  };

  const closeModal = () => {
    setModalVisible(!modalVisible);
    setError(false);
    setErrorMessage("");
    setWeight(null);
  };

  // const data = {
  //   labels: user.weight.map((element) => moment(element.date).format("MM-DD")), // Utilisez les dates des poids
  //   datasets: [
  //     {
  //       data: user.weight.map((element) => element.weight), // Utilisez les poids des utilisateurs
  //       color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
  //     },
  //   ],
  // };

  // const chartConfig = {
  //   axisLeft: {
  //     axisMinimum: 0,
  //   },
  //   axisRight: {
  //     enabled: false,
  //   },
  //   xAxis: {
  //     position: "BOTTOM",
  //   },
  //   zoom: {
  //     enabled: true,
  //     scaleX: true,
  //     scaleY: false,
  //   },
  //   pan: {
  //     enabled: true,
  //     scaleX: true,
  //     scaleY: false,
  //   },
  //   color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`, // Correctly define the color function
  // };

  return (
    <ScrollView style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <KeyboardAvoidingView
          style={styles.modalBackground}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalView}>
            <View style={styles.topModal}>
              <View style={styles.crossContainer}>
                <FontAwesome
                  name={"times"}
                  size={30}
                  color={"white"}
                  onPress={closeModal}
                  style={styles.infoIcon}
                />
              </View>
              <View style={styles.infoContainer}>
                <FontAwesome
                  name={"info-circle"}
                  size={25}
                  color={"#A3FD01"}
                  style={styles.infoIcon}
                />
                <Text style={styles.textInfo}>
                  Ajoutez votre poids une fois par semaine pour le voir
                  s'afficher sur le graphique et suivre votre progression.
                </Text>
              </View>
            </View>
            <View style={styles.bottomModal}>
              <TextInput
                style={styles.input}
                placeholder="Ton poids"
                keyboardType="numeric"
                onChangeText={(value) => setWeight(value)}
                value={weight}
              />
              {error && <Text style={styles.errorText}>{errorMessage}</Text>}
              <Button
                textButton="Valider"
                textColor="#A3FD01"
                width="180"
                height="40"
                background="#272D34"
                borderWidth="1"
                borderColor="#A3FD01"
                onPress={changeWeight}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Statistiques</Text>
        <Underline width={100} />
      </View>
      <View style={styles.secondTtitleContainer}>
        <Text style={styles.secondTitle}>Global</Text>
        <Underline width={30} />
      </View>
      <View style={styles.settingWrapper}>
        <View style={styles.settingContainer}>
          <View style={styles.inputWrapper}>
            <TouchableOpacity style={styles.inputContainer} activeOpacity={0.7}>
              <Text style={styles.text}>
                Total entraînements effectués :
                <Text style={styles.span}> 0</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.secondTtitleContainer}>
        <Text style={styles.secondTitle}>Ton suivi de poids</Text>
        <Underline width={80} />
      </View>

      <View style={{ alignItems: "center" }}>
        <LineChart
          data={{
            labels,
            datasets: [
              {
                data: weights,
              },
            ],
          }}
          width={Dimensions.get("window").width}
          height={220}
          yAxisSuffix="kg"
          yAxisInterval={1}
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity
          style={styles.buttonContainer}
          activeOpacity={0.8}
          onPress={() => setModalVisible(!modalVisible)}
        >
          <Text style={styles.buttonText}>Ajouter mon poids</Text>
          <FontAwesome name={"plus-circle"} size={30} color={"#272D34"} />
        </TouchableOpacity>
      </View>
      {/* <View style={{ alignItems: "center" }}>
        <LineChart
          style={{ width: Dimensions.get("window").width, height: 220 }}
          data={data}
          chartConfig={chartConfig}
          ref={chartRef}
        />
      </View> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D36",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "85%",
    height: 300,
    backgroundColor: "#272D34",
    borderRadius: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  topModal: {
    marginBottom: 30,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 10,
  },
  bottomModal: {
    justifyContent: "center",
    alignItems: "center",
  },
  crossContainer: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 35,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  errorText: {
    color: "red",
  },
  infoIcon: {
    marginRight: 10,
  },
  textInfo: {
    color: "white",
    fontSize: 12,
  },
  titleContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 40,
    color: "white",
    fontWeight: 600,
  },
  secondTtitleContainer: {
    marginBottom: 20,
  },
  secondTitle: {
    fontSize: 24,
    color: "white",
    fontWeight: 600,
  },
  settingWrapper: {
    alignItems: "center",
    marginBottom: 30,
  },
  settingContainer: {
    width: "100%",
    maxWidth: 500,
    height: 70,
    backgroundColor: "#EBF2F4",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  inputWrapper: {
    width: "90%",
    backgroundColor: "white",
    height: "70%",
    borderRadius: 20,
    justifyContent: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    height: 30,
  },
  span: {
    fontWeight: 600,
    color: "black",
  },
  buttonContainer: {
    width: 220,
    backgroundColor: "#A3FD01",
    height: 40,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  buttonText: {
    color: "black",
    fontSize: 18,
    fontWeight: 600,
  },
});
