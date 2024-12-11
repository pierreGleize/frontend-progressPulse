import { StyleSheet, Text, TouchableOpacity, View, Image, ImageBackground } from "react-native";
import Button from "../components/Button";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useSelector } from "react-redux";

export default function Exercice({ navigation }) {

  return (
    <View style={styles.container}>
        <View style={styles.topContainer}>
            <ImageBackground style={styles.image} source={require('../assets/abdos/crunchpoulie.gif')}>
            <FontAwesome
            name={"chevron-left"}
            size={24}
            color={"#3BC95F"}
            onPress={() => navigation.navigate("TabNavigator")}
            style={{ marginLeft: 15, marginTop: 40 }}
            />
            </ImageBackground>
        </View>
        <View>
            <Text style={styles.title}>Crunch Poulie</Text>
            <TouchableOpacity activeOpacity={0.7} style={styles.btn}>
                <Text style={styles.btnContainer}>Voir les instructions</Text>
            </TouchableOpacity>
        </View>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D36",
    paddingHorizontal: 10,
  },

  image: {
    height: 370,
    width: "100%",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },

  title: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: "white",
  },

  btn : {
    width: '40%',
    alignItems: 'center',
    paddingTop: 8,
    backgroundColor: 'transparent',
    borderRadius: 10,
    borderColor: '#A3FD01',
    borderWidth: 1,
  },

  btnContainer: {
    color: '#A3FD01', 
    justifyContent: "center",
  },
});