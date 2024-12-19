import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import Button from "../components/Button";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../reducers/user";

export default function SignupScreen({ navigation }) {
  const dispatch = useDispatch();
  const valeurDuReducer = useSelector((state) => state.user.value);
  console.log(valeurDuReducer);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [wrongEmail, setWrongEmail] = useState(false);
  const [emptyFields, setEmptyFields] = useState(false);
  const [signupError, setSignupError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const EMAIL_REGEX =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  function handleSignup() {
    if (!email || !username || !password) {
      setWrongEmail(false);
      setEmptyFields(true);
    } else {
      setEmptyFields(false);
      if (!EMAIL_REGEX.test(email)) {
        setWrongEmail(true);
      } else {
        setWrongEmail(false);
        setEmptyFields(false);
        const newUser = {
          username: username,
          email: email,
          password: password,
        };
        setIsLoading(true);
        fetch(`${process.env.EXPO_PUBLIC_SERVER_IP}/users/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.result === false) {
              console.log(data.error);
              setSignupError(data.error);
              setIsLoading(false);
            } else {
              dispatch(login(data.userInfos));
              navigation.navigate("TabNavigator", { screen: "Home" });
              setIsLoading(false);
            }
          });
      }
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Image
        source={require("../assets/illustrations/imageSigninSignup.webp")}
        style={styles.image}
      ></Image>
      <Text style={styles.mainTitle}>Commence ton aventure avec</Text>
      <Text style={styles.subTitle}>Progress Pulse</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom d'utilisateur"
        onChangeText={(value) => setUsername(value)}
        value={username}
        accessibilityLabel="Entrez votre nom d'utilisateur"
      ></TextInput>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(value) => setEmail(value)}
        value={email}
        autoCapitalize="none"
        accessibilityLabel="Entrez votre email"
      ></TextInput>
      <TextInput
        style={styles.input}
        secureTextEntry={true}
        placeholder="Mot de passe"
        accessibilityLabel="Entrez votre mot de passe"
        onChangeText={(value) => setPassword(value)}
        value={password}
      ></TextInput>
      {emptyFields && (
        <Text style={styles.error}>Veuillez remplir tous les champs</Text>
      )}
      {wrongEmail && (
        <Text style={styles.error}>Veuillez saisir un email au bon format</Text>
      )}
      {signupError && <Text style={styles.error}>{signupError}</Text>}
      <Button
        textButton="S'inscrire"
        textColor="black"
        width="50 %"
        height="40"
        background="#A3FD01"
        onPress={handleSignup}
        accessibilityLabel={"S'inscrire"}
        accessibilityHint={"Vous allez être redirigé vers la page d'acceuil de l'application"}
      ></Button>
      <View style={styles.alreadyAccountSection}>
        <Text style={styles.alreadyAccount}>Déjà un compte ? </Text>
        <TouchableOpacity 
        onPress={() => navigation.navigate("Signin")}
        accessibilityLabel="Connecte-toi"
        accessibilityHint="Vous allez être redirigé vers la page de connection"
        >
          <Text style={styles.connect}>Connecte-toi !</Text>
        </TouchableOpacity>
      </View>
      {isLoading && (
        <View style={styles.backgroundLoading}>
          <ActivityIndicator size="large" color="#A3FD01" animating={true} />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D36",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 50,
  },
  mainTitle: {
    fontSize: 25,
    textAlign: "center",
    color: "white",
    fontWeight: "600",
  },
  subTitle: {
    fontSize: 35,
    textAlign: "center",
    color: "#3BC95F",
    fontWeight: "800",
  },
  input: {
    width: "80%",
    height: 40,
    borderRadius: 10,
    backgroundColor: "white",
    marginTop: 25,
    paddingLeft: 10,
    fontSize: 18,
  },
  btn: {
    fontSize: 40,
    borderRadius: 10,
    backgroundColor: "grey",
    margin: 20,
  },
  btnText: {
    fontSize: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    textAlign: "center",
    color: "white",
  },
  image: {
    height: "35%",
    width: "100%",
  },

  alreadyAccountSection: {
    margin :'auto',
    flexDirection: "row",
  },
  alreadyAccount: {
    color: "white",
    fontSize: 18,
    fontWeight: "300",
  },
  connect: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    borderBottomWidth: 1,
    borderBottomColor: "white",
    paddingBottom: 2,
  },
  error: {
    color: "red",
    marginTop: 10,
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
