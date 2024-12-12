import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function WorkoutSummaryScreen({ navigation, route }) {
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity
          style={styles.backToContainer}
          onPress={() => navigation.navigate("Settings")}
        >
          <FontAwesome name={"chevron-left"} size={24} color={"#3BC95F"} />
          <Text style={styles.backToText}>Réglages</Text>
        </TouchableOpacity>

        <Text style={styles.topTitle}>Son</Text>
      </View>
      <View style={styles.settingWrapper}>
        <View style={styles.settingContainer}>
          <View style={styles.inputWrapper}>
            <TouchableOpacity style={styles.inputContainer} activeOpacity={0.7}>
              <Text style={styles.text}>test</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.inputContainer} activeOpacity={0.7}>
              <Text style={styles.text}>test</Text>
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
});
