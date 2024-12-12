import {
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  Modal,
  Platform,
} from "react-native";
import Underline from "../components/Underline";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import Button from "../components/Button";
import { updateEmail } from "../reducers/user";

export default function SettingsScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);

  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

  function validateEmail(email) {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
  }

  const changeEmail = () => {
    if (email.length === 0) {
      setErrorMessage("Veuillez remplir tous les champs");
      setError(true);
      return;
    }
    if (!validateEmail(email)) {
      setErrorMessage("Adresse email non valide");
      setError(true);
      return;
    }
    fetch(`${process.env.EXPO_PUBLIC_SERVER_IP}/users/changeEmail`, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ email, password, token: user.token }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result === false) {
          setError(true);
          setErrorMessage(data.error);
        } else {
          dispatch(updateEmail(data.newEmail));
          closeModal();
        }
      });
  };

  const closeModal = () => {
    setError(false);
    setPassword("");
    setEmail("");
    setModalVisible(!modalVisible);
  };

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
                <View style={styles.infoContainer}>
                  <FontAwesome
                    name={"exclamation-triangle"}
                    size={25}
                    color={"#A3FD01"}
                    style={styles.infoIcon}
                  />
                  <Text style={styles.span}>ATTENTION</Text>
                </View>
                <FontAwesome
                  name={"times"}
                  size={30}
                  color={"white"}
                  onPress={closeModal}
                  style={styles.infoIcon}
                />
              </View>

              <Text style={styles.textInfo}>
                En modifiant votre adresse e-mail, vous changerez également
                l'e-mail associé à votre compte. Assurez-vous que votre nouvelle
                adresse e-mail est valide et accessible avant de continuer.
              </Text>
            </View>
            <View style={styles.bottomModal}>
              <TextInput
                style={styles.input}
                placeholder={"Entrée votre nouvelle adresse email"}
                placeholderTextColor={"#272D34"}
                onChangeText={(value) => setEmail(value)}
                value={email}
              />
              <TextInput
                style={styles.input}
                secureTextEntry={true}
                placeholder={"Mot de passe"}
                placeholderTextColor={"#272D34"}
                onChangeText={(value) => setPassword(value)}
                value={password}
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
                onPress={changeEmail}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <Text style={styles.title}>Réglages</Text>
      <Underline width={100} />
      <View style={styles.settingWrapper}>
        <View style={styles.settingContainer}>
          <View style={styles.inputWrapper}>
            <TouchableOpacity
              style={styles.inputContainer}
              activeOpacity={0.7}
              onPress={() => setModalVisible(true)}
            >
              <FontAwesome
                name={"envelope"}
                size={28}
                color={"#272D34"}
                style={styles.infoIcon}
              />
              <Text style={styles.text}>{user.email}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.inputContainer}
              activeOpacity={0.7}
              onPress={() => navigation.navigate("song")}
            >
              <FontAwesome
                name={"music"}
                size={28}
                color={"#272D34"}
                style={styles.infoIcon}
              />
              <Text style={styles.text}>{user.sound}</Text>
              <FontAwesome
                name={"arrow-right"}
                size={20}
                color={"#272D34"}
                style={styles.infoIcon}
              />
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
          Enregistre ton poids chaque semaine pour suivre tes progrès et rester
          motivé !
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D36",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 40,
    color: "white",
    fontWeight: 600,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "85%",
    height: "350",
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
  bottomModal: {
    justifyContent: "center",
    alignItems: "center",
  },
  crossContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  span: {
    color: "white",
    fontWeight: 600,
  },
  infoIcon: {
    marginRight: 10,
  },
  textInfo: {
    color: "white",
    fontSize: 14,
  },
  errorText: {
    color: "red",
  },
  settingWrapper: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  settingContainer: {
    width: "100%",
    maxWidth: 500,
    height: 250,
    backgroundColor: "#EBF2F4",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  inputWrapper: {
    width: "85%",
    backgroundColor: "white",
    height: "85%",
    borderRadius: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    borderBottomColor: "#EBF2F4",
    borderBottomWidth: 1,
    height: 40,
  },
  text: {
    margin: "auto",
    color: "#272D34",
  },
  input: {
    width: "100%",
    height: 35,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  textInfo: {
    color: "white",
  },
});
