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
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import Button from "../components/Button";
import { updateEmail, updateUsername, logout } from "../reducers/user";
import { removeAllWorkout } from "../reducers/workouts";
import { resetWorkoutsHistory } from "../reducers/workoutsHistory";

export default function SettingsScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [username, setUsername] = useState("");
  const [modalEmailVisible, setModalEmailVisible] = useState(false);
  const [modalPasswordVisible, setModalPasswordVisible] = useState(false);
  const [modalUsernameVisible, setModalUsernameVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);

  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

  // Pour tester un email
  function validateEmail(email) {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
  }

  // Envoyer une requête au backend  pour changer l'email et enregistrer les changements dans le reducer
  const changeEmail = () => {
    if (!email || !password) {
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
          closeModal("email");
        }
      });
  };

  // Pour changer son password
  const changePassword = () => {
    if (!email || !password || !newPassword) {
      setErrorMessage("Veuillez remplir tous les champs");
      setError(true);
      return;
    }
    if (!validateEmail(email)) {
      setErrorMessage("Adresse email non valide");
      setError(true);
      return;
    }
    fetch(`${process.env.EXPO_PUBLIC_SERVER_IP}/users/changePassword`, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ email, password, token: user.token, newPassword }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result === false) {
          setError(true);
          setErrorMessage(data.error);
        } else {
          closeModal("password");
        }
      });
  };

  // Pour changer son username
  const changeUsername = () => {
    if (!email || !password || !username) {
      setErrorMessage("Veuillez remplir tous les champs");
      setError(true);
      return;
    }
    if (!validateEmail(email)) {
      setErrorMessage("Adresse email non valide");
      setError(true);
      return;
    }
    fetch(`${process.env.EXPO_PUBLIC_SERVER_IP}/users/changeUsername`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ email, password, token: user.token, username }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result === false) {
          setError(true);
          setErrorMessage(data.error);
        } else {
          dispatch(updateUsername(data.newUsername));
          closeModal("username");
        }
      });
  };

  const closeModal = (modal) => {
    setError(false);
    setErrorMessage("");
    setPassword("");
    setEmail("");
    if (modal === "email") {
      setModalEmailVisible(false);
    } else if (modal === "password") {
      setModalPasswordVisible(false);
      setNewPassword("");
    } else if (modal === "username") {
      setModalUsernameVisible(false);
      setUsername("");
    }
  };

  const handleLogout = () => {
    dispatch(removeAllWorkout());
    dispatch(resetWorkoutsHistory());
    dispatch(logout());
    navigation.navigate("Signin");
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalEmailVisible}
        onRequestClose={() => setModalEmailVisible(!modalEmailVisible)}
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
                    accessibilityLabel="Message d'attention lorsque vous voulez changer vos coordonnées"
                  />
                  <Text style={styles.span}>ATTENTION</Text>
                </View>
                <TouchableOpacity
                  onPress={() => closeModal("email")}
                  activeOpacity={0.7}
                  accessibilityLabel="Permet de fermer la modale"
                >
                  <FontAwesome
                    name={"times"}
                    size={30}
                    color={"white"}
                    style={styles.infoIcon}
                  />
                </TouchableOpacity>
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
                placeholder={"Entrer votre nouvelle adresse email"}
                placeholderTextColor={"#272D34"}
                onChangeText={(value) => setEmail(value)}
                value={email}
                accessibilityLabel="Entrez votre nouvelle adress mail"
              />
              <TextInput
                style={styles.input}
                secureTextEntry={true}
                placeholder={"Mot de passe"}
                placeholderTextColor={"#272D34"}
                onChangeText={(value) => setPassword(value)}
                value={password}
                accessibilityLabel="Entrez votre mot de passe"
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
                accessibilityLabel={
                  "Permet de fermer la modale avec les coordonnées modifié"
                }
                accessibilityHint={
                  "Vous allez être redirigé vers la page réglages avec vos nouvelles coordonnées"
                }
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalPasswordVisible}
        onRequestClose={() => setModalPasswordVisible(!modalPasswordVisible)}
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
                    accessibilityLabel="Message d'attention lorsque vous voulez changer vos coordonnées"
                  />
                  <Text style={styles.span}>ATTENTION</Text>
                </View>
                <TouchableOpacity
                  onPress={() => closeModal("password")}
                  activeOpacity={0.7}
                  accessibilityLabel="Permet de fermer la modale"
                >
                  <FontAwesome
                    name={"times"}
                    size={30}
                    color={"white"}
                    style={styles.infoIcon}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.textInfo}>
                Vous êtes sur le point de modifier votre mot de passe.
                Assurez-vous de bien le mémoriser !
              </Text>
            </View>
            <View style={styles.bottomModal}>
              <TextInput
                style={styles.input}
                placeholder={"Entrer votre adresse email"}
                placeholderTextColor={"#272D34"}
                onChangeText={(value) => setEmail(value)}
                value={email}
                accessibilityLabel="Entrez votre adresse mail"
              />
              <TextInput
                style={styles.input}
                secureTextEntry={true}
                placeholder={"Mot de passe"}
                placeholderTextColor={"#272D34"}
                onChangeText={(value) => setPassword(value)}
                value={password}
                accessibilityLabel="Entrez votre mot de passe"
              />
              <TextInput
                style={styles.input}
                secureTextEntry={true}
                placeholder={"Nouveau mot de passe de passe"}
                placeholderTextColor={"#272D34"}
                onChangeText={(value) => setNewPassword(value)}
                value={newPassword}
                accessibilityLabel="Entrez votre nouveau mot de passe"
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
                onPress={changePassword}
                accessibilityLabel={
                  "Permet de fermer la modale avec les coordonnées modifié"
                }
                accessibilityHint={
                  "Vous allez être redirigé vers la page réglages avec vos nouvelles coordonnées"
                }
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalUsernameVisible}
        onRequestClose={() => setModalUsernameVisible(!modalUsernameVisible)}
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
                    accessibilityLabel="Message d'attention lorsque vous voulez changer vos coordonnées"
                  />
                  <Text style={styles.span}>ATTENTION</Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => closeModal("username")}
                  accessibilityLabel="Permet de fermer la modale"
                >
                  <FontAwesome
                    name={"times"}
                    size={30}
                    color={"white"}
                    style={styles.infoIcon}
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.textInfo}>
                Vous êtes sur le point de modifier votre nom d'utilisateur.
                Assurez-vous qu'il vous convient !
              </Text>
            </View>
            <View style={styles.bottomModal}>
              <TextInput
                style={styles.input}
                placeholder={"Entrer votre adresse email"}
                placeholderTextColor={"#272D34"}
                onChangeText={(value) => setEmail(value)}
                value={email}
                accessibilityLabel="Entrez votre adresse mail"
              />
              <TextInput
                style={styles.input}
                secureTextEntry={true}
                placeholder={"Mot de passe"}
                placeholderTextColor={"#272D34"}
                onChangeText={(value) => setPassword(value)}
                value={password}
                accessibilityLabel="Entrez votre mot de passe"
              />
              <TextInput
                style={styles.input}
                placeholder={"Entrer votre nouveau nom d'utilisateur"}
                placeholderTextColor={"#272D34"}
                onChangeText={(value) => setUsername(value)}
                value={username}
                accessibilityLabel="Entrez votre nouveau nom d'utilisateur"
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
                onPress={changeUsername}
                accessibilityLabel={
                  "Permet de fermer la modale avec les coordonnées modifié"
                }
                accessibilityHint={
                  "Vous allez être redirigé vers la page réglages avec vos nouvelles coordonnées"
                }
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
              onPress={() => setModalEmailVisible(true)}
              accessibilityLabel="Permet d'afficher la modale pour changer son mail"
              accessibilityHint="Une modale va s'ouvrir où vous pourrez changer votre mail"
            >
              <FontAwesome
                name={"envelope"}
                size={20}
                color={"#A3FD01"}
                style={styles.infoIcon}
              />
              <Text style={styles.text}>{user.email}</Text>
              <FontAwesome
                name={"pencil"}
                size={15}
                color={"white"}
                style={{ position: "absolute", right: 10 }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.inputContainer}
              activeOpacity={0.7}
              onPress={() => setModalPasswordVisible(true)}
              accessibilityLabel="Permet d'afficher la modale pour changer son mot de passe"
              accessibilityHint="Une modale va s'ouvrir où vous pourrez changer votre mot de passe"
            >
              <FontAwesome
                name={"lock"}
                size={25}
                color={"#A3FD01"}
                style={styles.infoIcon}
              />
              <Text style={styles.text}>*********</Text>
              <FontAwesome
                name={"pencil"}
                size={15}
                color={"white"}
                style={{ position: "absolute", right: 10 }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.inputContainer}
              activeOpacity={0.7}
              onPress={() => setModalUsernameVisible(true)}
              accessibilityLabel="Permet d'afficher la modale pour changer son nom"
              accessibilityHint="Une modale va s'ouvrir où vous pourrez changer votre nom"
            >
              <FontAwesome
                name={"user"}
                size={25}
                color={"#A3FD01"}
                style={styles.infoIcon}
              />
              <Text style={styles.text}>{user.username}</Text>
              <FontAwesome
                name={"pencil"}
                size={15}
                color={"white"}
                style={{ position: "absolute", right: 10 }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.inputContainer}
              activeOpacity={0.7}
              onPress={() => navigation.navigate("song")}
              accessibilityLabel="Permet d'aller sur la page Son"
              accessibilityHint="Vous allez être rediriger vers la page Son pour changer le son du minuteur"
            >
              <FontAwesome
                name={"music"}
                size={23}
                color={"#A3FD01"}
                style={styles.infoIcon}
              />
              <Text style={styles.text}>{user.sound}</Text>
              <FontAwesome
                name={"arrow-right"}
                size={15}
                color={"white"}
                style={{ position: "absolute", right: 10 }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.inputContainer}
              activeOpacity={0.7}
              onPress={handleLogout}
              accessibilityLabel="Permet de se déconnecter"
              accessibilityHint="Vous allez être rediriger vers la page de connexion"
            >
              <FontAwesome6
                name={"right-to-bracket"}
                size={20}
                color={"#A3FD01"}
                style={styles.infoIcon}
              />
              <Text style={styles.text}>Déconnexion</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    color: "#FF4500",
  },
  settingWrapper: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  settingContainer: {
    width: "100%",
    maxWidth: 500,
    height: 220,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  inputWrapper: {
    width: "93%",
    height: "85%",
    justifyContent: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
    borderBottomWidth: 1,
    height: 40,
  },
  text: {
    marginLeft: 20,
    color: "white",
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
