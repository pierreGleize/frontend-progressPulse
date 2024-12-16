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
  Alert,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useState, useEffect } from "react";
import HystoryWorkouts from "../components/HystoryWorkout";

export default function HystoryScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity
          style={styles.backToContainer}
          onPress={() => navigation.navigate("Stats")}
        >
          <FontAwesome name={"chevron-left"} size={24} color={"#3BC95F"} />
          <Text style={styles.backToText}>Statisques</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Suivie de séance</Text>
      </View>
      <ScrollView style={styles.weightContainer}>
        <HystoryWorkouts />
        <HystoryWorkouts />
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
    padding: 15,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
});
