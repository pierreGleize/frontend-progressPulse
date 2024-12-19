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
import { addAllUserWorkouts } from "../reducers/workouts";
import { addAllWorkoutsHistory } from "../reducers/workoutsHistory";

export default function SigninScreen({ navigation }) {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [wrongEmail, setWrongEmail] = useState(false);
  const [emptyFields, setEmptyFields] = useState(false);
  const [signupError, setSignupError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const EMAIL_REGEX =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  function handleSignin() {
    if (!email || !password) {
      setWrongEmail(false);
      setEmptyFields(true);
    } else {
      setEmptyFields(false);
      if (!EMAIL_REGEX.test(email)) {
        setWrongEmail(true);
      } else {
        setWrongEmail(false);
        setEmptyFields(false);
        const user = {
          email: email,
          password: password,
        };
        setIsLoading(true)
        fetch(`${process.env.EXPO_PUBLIC_SERVER_IP}/users/signin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.result === false) {
              console.log(data.error);
              setSignupError(data.error);
              setIsLoading(false)
            } else {
              const userToken = data.userInfos.token;
              dispatch(login(data.userInfos));
              fetch(
                `${process.env.EXPO_PUBLIC_SERVER_IP}/usersWorkouts/${data.userInfos.token}`
              )
                .then((response) => response.json())
                .then((data) => {
                  if (data.userWorkouts) {
                    dispatch(addAllUserWorkouts(data.userWorkouts));
                  }
                  fetch(
                    `${process.env.EXPO_PUBLIC_SERVER_IP}/histories/${userToken}`
                  )
                    .then((response) => response.json())
                    .then((data) => {
                      dispatch(addAllWorkoutsHistory(data.histories));
                      navigation.navigate("TabNavigator", { screen: "Home" });
                      setIsLoading(false)
                    });
                });
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
      <Text style={styles.mainTitle}>Atteins tes objectifs avec</Text>
      <Text style={styles.subTitle}>Progress Pulse</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(value) => setEmail(value)}
        value={email}
        autoCapitalize="none"
      ></TextInput>
      <TextInput
        style={styles.input}
        secureTextEntry={true}
        placeholder="Mot de passe"
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
        textButton="Se connecter"
        textColor="black"
        width="50 %"
        height="40"
        background="#A3FD01"
        onPress={handleSignin}
      ></Button>
      <TouchableOpacity onPress={() => navigation.navigate("passwordForgotten")}>
          <Text style={styles.signup}>Mot de passe oublié ?</Text>
      </TouchableOpacity>
      <View style={styles.alreadyAccountSection}>
        <Text style={styles.alreadyAccount}>Pas encore de compte ? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.signup}>Inscris-toi !</Text>
        </TouchableOpacity>
      </View>
      {isLoading&& <View style={styles.backgroundLoading}>
        <ActivityIndicator size="large" color="#A3FD01" animating={true}/>
      </View>}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D36",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 40,
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
    height: "40%",
    width: "100%",
  },

  alreadyAccountSection: {
    margin: 'auto',
    flexDirection: "row",
  },
  alreadyAccount: {
    color: "white",
    fontSize: 18,
    fontWeight: "300",
  },
  signup: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    borderBottomWidth: 1,
    borderBottomColor: "white",
    paddingBottom: 2,
  },
  error: {
    color: "#FF4500",
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
