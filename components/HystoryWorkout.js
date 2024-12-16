import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import Underline from "./Underline";

export default function HystoryWorkout() {
  const [expanded, setExpanded] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const cardHeight = useRef(new Animated.Value(90)).current;
  const contentHeight = useRef(0);

  useEffect(() => {
    if (isReady && expanded) {
      // Lance l'animation d'agrandissement une fois la hauteur mesurée
      Animated.timing(cardHeight, {
        toValue: contentHeight.current + 90,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [isReady, expanded]);

  const toggleCard = () => {
    if (expanded) {
      // Réduire la carte
      Animated.timing(cardHeight, {
        toValue: 90,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setExpanded(false));
    } else if (isReady) {
      // Agrandir la carte (si la hauteur a déjà été mesurée)
      setExpanded(true);
    }
  };

  return (
    <TouchableOpacity
      onPress={toggleCard}
      style={{ width: "100%" }}
      activeOpacity={1}
    >
      <Animated.View style={[styles.card, { height: cardHeight }]}>
        <View>
          <Text style={styles.text}>Full body</Text>
          <Text style={styles.text}>16/12/2024</Text>
        </View>
        <FontAwesome
          name={expanded ? "minus-circle" : "plus-circle"}
          size={25}
          color={"#3BC95F"}
          style={{ position: "absolute", right: 10, top: 10 }}
        />
        <View style={styles.starContainer}>
          <FontAwesome name={"star"} size={15} color={"#3BC95F"} />
          <FontAwesome name={"star"} size={15} color={"#3BC95F"} />
          <FontAwesome name={"star"} size={15} color={"#3BC95F"} />
        </View>
        <View
          style={{ opacity: expanded ? 1 : 0 }}
          onLayout={(event) => {
            if (contentHeight.current === 0) {
              contentHeight.current = event.nativeEvent.layout.height; // Mesure la hauteur
              setIsReady(true);
            }
          }}
        >
          <Text style={styles.muscleGroupText}>Développé couché :</Text>
          <Underline width={60} />
          <View style={styles.perfcontainer}>
            <LinearGradient
              colors={["#1C1C45", "#4645AB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.linearPerf}
            >
              <Text style={styles.perf}>Série 1 : 4 x 50 kg</Text>
            </LinearGradient>
            <LinearGradient
              colors={["#1C1C45", "#4645AB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.linearPerf}
            >
              <Text style={styles.perf}>Série 2 : 4 x 55 kg</Text>
            </LinearGradient>
            <LinearGradient
              colors={["#1C1C45", "#4645AB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.linearPerf}
            >
              <Text style={styles.perf}>Série 3 : 4 x 60 kg</Text>
            </LinearGradient>
          </View>
          <Text style={styles.textRessenti}>
            Ressenti : Petite douleur à l'épaule
          </Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    // backgroundColor: "#2C2C62",
    borderRadius: 10,
    padding: 10,
    overflow: "hidden",
    marginBottom: 15,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
    borderBottomWidth: 1,
  },
  text: {
    color: "white",
    fontSize: 16,
    marginBottom: 5,
  },
  starContainer: {
    flexDirection: "row",
    marginBottom: 5,
  },
  muscleGroupText: {
    color: "white",
    fontSize: 16,
  },
  perfcontainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 10,
  },
  linearPerf: {
    height: 23,
    width: "45%",
    marginBottom: 10,
    borderRadius: 10,
    justifyContent: "center",
  },
  perf: {
    color: "#ffffff",
    textAlign: "center",
  },
  textRessenti: {
    color: "white",
    fontSize: 16,
    marginBottom: 10,
  },
});
