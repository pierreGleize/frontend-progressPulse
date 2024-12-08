import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SignupScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Signup Screen</Text>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("Signin")}
      >
        <Text style={styles.btnText}>Go to Signin</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("TabNavigator", { screen: "Home" })}
      >
        <Text style={styles.btnText}>Connexion</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "purple",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 50,
    padding: 50,
    textAlign: "center",
    color: "white",
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
});
