import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addWeight } from "../reducers/user";
import moment from "moment";
import Button from "../components/Button";

export default function WeightScreen({ navigation, route }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [weight, setWeight] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);

  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

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

  const startWeight = user.weight?.length === 0 ? 0 : user.weight[0].weight;
  const startDate =
    user.weight?.length === 0
      ? "DD/MM/YYYY"
      : moment(user.weight[0].date).format("Do MMM YYYY");

  const currentWeight =
    user.weight?.length === 0 ? 0 : user.weight.at(-1).weight;
  const currentDate =
    user.weight?.length === 0
      ? "DD/MM/YYYY"
      : moment(user.weight.at(-1).date).format("Do MMM YYYY");

  const targetWeight = !user.target?.weight ? 0 : user.target.weight;
  const targetDate =
    user.target.length === 0
      ? "DD/MM/YYYY"
      : moment(user.target.date).format("Do MMM YYYY");

  console.log(user.target.weight);

  return (
    <View style={styles.container}>
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
                width={180}
                height={40}
                background="#272D34"
                borderWidth={1}
                borderColor="#A3FD01"
                onPress={changeWeight}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <View style={styles.topContainer}>
        <TouchableOpacity
          style={styles.backToContainer}
          onPress={() => navigation.navigate("Stats")}
        >
          <FontAwesome name={"chevron-left"} size={24} color={"#3BC95F"} />
          <Text style={styles.backToText}>Réglages</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Suivie de poids</Text>
      </View>
      <Text style={styles.nameTitle}>{user.username}</Text>
      <ScrollView style={styles.weightContainer}>
        <View style={styles.objectif}>
          <View style={styles.colunmContainer}>
            <View style={styles.colunm}>
              <Text style={styles.startTitle}>Start</Text>
              <Text style={styles.text}>{startWeight} kg</Text>
              <Text style={styles.text}>{startDate}</Text>
            </View>
            <View style={styles.colunm}>
              <Text style={styles.startTitle}>Current</Text>
              <Text style={styles.text}>{currentWeight} kg</Text>
              <Text style={styles.text}>{currentDate}</Text>
            </View>
            <View style={styles.colunm}>
              <Text style={styles.startTitle}>Target</Text>
              <Text style={styles.text}>{targetWeight} kg</Text>
              <Text style={styles.text}>{targetDate}</Text>
            </View>
          </View>
        </View>
        <View style={styles.progress}></View>
        <View style={styles.weightList}></View>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.buttonContainer}
            activeOpacity={0.8}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Text style={styles.buttonText}>Ajouter mon poids</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonContainer}
            activeOpacity={0.8}
            // onPress={() => setModalVisible(!modalVisible)}
          >
            <Text style={styles.buttonText}>Ajouter un objectif de poids</Text>
          </TouchableOpacity>
        </View>
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
  //
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
  textInfo: {
    color: "white",
    fontSize: 12,
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
  nameTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: 600,
    textAlign: "center",
    marginBottom: 20,
  },
  weightContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 16,
    marginVertical: 16,
    shadowColor: "#FFFFFF",
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  objectif: {
    borderBottomWidth: 1,
    marginBottom: 16,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
    height: 200,
  },
  colunmContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    height: "100%",
  },
  startTitle: {
    fontSize: 20,
    color: "#A3FD01",
  },
  colunm: {
    justifyContent: "space-around",
    alignItems: "center",
  },
  text: {
    color: "white",
  },
  progress: {
    backgroundColor: "rgba(0, 255, 128, 0.2)",
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
    marginBottom: 16,
    borderBottomWidth: 1,
    height: 120,
  },
  weightList: {
    backgroundColor: "yellow",
    height: 500,
    marginBottom: 16,
  },
  buttonContainer: {
    width: "48%",
    backgroundColor: "#A3FD01",
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "black",
    fontSize: 14,
    fontWeight: 600,
    textAlign: "center",
  },
  buttonWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
});
