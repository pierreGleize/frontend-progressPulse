import { StyleSheet, Text, TouchableOpacity, View, Image, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import Button from "../components/Button";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../reducers/user";

export default function SignupScreen({ navigation }) {

  const dispatch = useDispatch()

  const valeurDuReducer = useSelector((state) => state.user.value);
	console.log(valeurDuReducer)

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [wrongEmail, setWrongEmail] = useState(false)
  const [emptyFields, setEmptyFields] = useState(false)
  const [signupError, setSignupError] = useState(null)

  const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  function handleSignup(){
    if (!email || !username || !password){
      setWrongEmail(false)
      setEmptyFields(true)
    } else {
      setEmptyFields(false)
      if(!EMAIL_REGEX.test(email)){
        setWrongEmail(true)
      } else {
        setWrongEmail(false)
        setEmptyFields(false)
        const newUser = {
          username: username,
          email: email,
          password: password
        }
        fetch('http://192.168.1.100:3000/users/signup',{
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser),
        })
        .then(response => response.json())
        .then(data => {
          if (data.result === false){
            console.log(data.error)
            setSignupError(data.error)
          } else {
            dispatch(login(data.userInfos))
            navigation.navigate("TabNavigator", { screen: "Home" })
          }
        })
      }
    }
    
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Image source={require("../assets/illustrations/imageSigninSignup.webp")}style={styles.image} ></Image>
      <Text style={styles.mainTitle}>Commence ton aventure avec</Text>
      <Text style={styles.subTitle}>Progress Pulse</Text>
      <TextInput style={styles.input} placeholder="Nom d'utilisateur" onChangeText={(value) => setUsername(value)} value={username}></TextInput>
      <TextInput style={styles.input} placeholder="Email" onChangeText={(value) => setEmail(value)} value={email}></TextInput>
      <TextInput style={styles.input} secureTextEntry={true} placeholder="Mot de passe" onChangeText={(value) => setPassword(value)} value={password}></TextInput>
      {emptyFields && <Text style={styles.error}>Veuillez remplir tous les champs</Text>}
      {wrongEmail && <Text style={styles.error}>Veuillez saisir un email au bon format</Text>}
      {signupError && <Text style={styles.error}>{signupError}</Text>}
      <Button textButton="S'inscrire" textColor='black' width="50 %" height="40" background="#A3FD01" onPress={handleSignup}></Button>
      <View style={styles.orContainer}>
        <View style={styles.line}></View>
        <Text style={styles.or}>ou</Text>
        <View style={styles.line}></View>
      </View>
      <Button textButton="Signup with Google" textColor='black' width="80%" height="40" background="#A3FD01" onPress={handleSignup}></Button>
      <View style={styles.alreadyAccountSection}>
        <Text style={styles.alreadyAccount}>Déjà un compte ? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Signin")}>
          <Text style={styles.connect}>Connecte-toi !</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D36",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 50
  },
  mainTitle: {
    fontSize: 25,
    textAlign: "center",
    color: "white",
    fontWeight: "600"
  },
  subTitle:{
    fontSize: 35,
    textAlign: "center",
    color: "#3BC95F",
    fontWeight: "800"
  },
  input: {
    width: "80%",
    height: '35',
    borderRadius: 10,
    backgroundColor: "white",
    marginTop: 25,
    paddingLeft: 10,
    fontSize: 18
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
  button: {
    margin: 20
  },
  image: {
    height: "40%",
    width: "100%",
  },
  orContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"

  },
  line:{
    width: "35%",
    height: 1,
    backgroundColor: "white"
  },
  or:{
    color: "white",
    marginHorizontal: 10,
    fontSize: 20,
    fontWeight: "700"
  },
  alreadyAccountSection: {
    flexDirection: "row"
  },
  alreadyAccount: {
    color: "white",
    fontSize: 18,
    fontWeight: "300"
  },
  connect: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    borderBottomWidth: 1,
    borderBottomColor: 'white', 
    paddingBottom: 2
  },
  error: {
    color: "red",
    marginTop: 10
  }
});
