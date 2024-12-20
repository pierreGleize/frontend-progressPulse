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
  ActivityIndicator,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addWeight, updateTarget } from "../reducers/user";
import moment from "moment";
import Button from "../components/Button";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Progress from "react-native-progress";
import ConfettiCannon from "react-native-confetti-cannon";
import * as Haptics from "expo-haptics";

export default function WeightScreen({ navigation, route }) {
  const [modalVisibleWeight, setModalVisibleWeight] = useState(false);
  const [modalVisibleTarget, setModalVisibleTarget] = useState(false);
  const [weight, setWeight] = useState(null);
  const [weightTarget, setWeightTarget] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);
  const [date, setDate] = useState(new Date());
  const [progressValue, setProgressValue] = useState(0);
  const [progressValuePourcent, setProgressValuePourcent] = useState(0);
  const [isCheckedLoss, setIsCheckedLoss] = useState(false);
  const [isCheckedGain, setIsCheckedGain] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [initialWeightInput, setInitialWeighInput] = useState(null);

  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentWeight && targetWeight && user.target.objectif) {
      // Calcul en pourcentage l'objectif de l'utilisateur si il veut prendre ou perdre du poids
      let newProgressValuePourcent = Math.floor(
        ((user.target.initialWeight - currentWeight) * 100) /
          (user.target.initialWeight - targetWeight)
      );
      if (newProgressValuePourcent < 0) {
        newProgressValuePourcent = 0;
      } else if (newProgressValuePourcent > 100) {
        newProgressValuePourcent = 100;
      }
      // Même chose pour passer la valeur à Progress.Bar, Proggres.Circle qui accepte une valeure sur une  échelle de 0 à 1
      const newProgressValue =
        (user.target.initialWeight - currentWeight) /
        (user.target.initialWeight - targetWeight);

      setProgressValue(newProgressValue);
      setProgressValuePourcent(newProgressValuePourcent);

      if (newProgressValue === 1) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setShowConfetti(true);
      }
    }
  }, [user.weight, user.target]);

  //Pour ouvir le popup de la date
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  //Pour fermer le popup de la date
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  //Pour enregistrer la date sélectionnée lorsque l'utilisateur entre son objectif de poids
  const handleConfirmDate = (date) => {
    setDate(date);
    hideDatePicker();
  };
  // Ajouter un nouveau poids dans la BDD et l'enregistrer dans le reducer user
  const handleAddWeight = () => {
    if (!weight) {
      setError(true);
      setErrorMessage("Veuillez remplir correctement le champ de saisie");
      return;
    }
    // closeModalWeight();
    setIsLoading(true);
    fetch(`${process.env.EXPO_PUBLIC_SERVER_IP}/users/addWeight`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ weight, token: user.token }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result === false) {
          setError(true);
          setErrorMessage(data.error);
          setIsLoading(false);
          setModalVisibleWeight(true);
          // closeModalWeight();
        } else {
          dispatch(addWeight(data.newWeight));
          setIsLoading(false);
          closeModalWeight();
        }
      });
  };
  // Enregistrer son objectif de poids dans la BDD puis dans le reducer
  const addTargetWeight = () => {
    if (!weightTarget || !date || !initialWeightInput) {
      setError(true);
      setErrorMessage("Veuillez remplir correctement les champs de saisies");
      return;
    }
    if (!isCheckedGain && !isCheckedLoss) {
      setError(true);
      setErrorMessage("Veuillez cocher une case");
      return;
    }
    const objectif = isCheckedGain ? "Gain" : "Loss";
    // closeModalTarget();
    setIsLoading(true);
    fetch(`${process.env.EXPO_PUBLIC_SERVER_IP}/users/weightTarget`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        weight: weightTarget,
        token: user.token,
        date,
        objectif,
        initialWeight: initialWeightInput,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result === true) {
          dispatch(updateTarget(data.weightTarget));
          setIsLoading(false);
          closeModalTarget();
        } else {
          setError(true);
          setErrorMessage(data.error);
          setModalVisibleTarget(true);
          setIsLoading(false);
        }
      });
  };

  const closeModalWeight = () => {
    setModalVisibleWeight(!modalVisibleWeight);
    setError(false);
    setErrorMessage("");
    setWeight(null);
  };
  const closeModalTarget = () => {
    setModalVisibleTarget(!modalVisibleTarget);
    setError(false);
    setErrorMessage("");
    setWeightTarget(null);
    setDate(new Date());
    setIsCheckedGain(false);
    setIsCheckedLoss(false);
    setInitialWeighInput(null);
  };
  // Récupération de son poids de départ et la date correspondante, premier élément du tableau user.weight
  const startWeight = user.weight?.length === 0 ? 0 : user.weight[0].weight;
  const startDate =
    user.weight?.length === 0
      ? "DD/MM/YYYY"
      : moment(user.weight[0].date).format("Do MMM YYYY");

  // Récupération de son poids en cours et la date correspondante, dernier élément du tableau user.weight
  const currentWeight =
    user.weight?.length === 0 ? 0 : user.weight.at(-1).weight;
  const currentDate =
    user.weight?.length === 0
      ? "DD/MM/YYYY"
      : moment(user.weight.at(-1).date).format("Do MMM YYYY");

  // Récupération de son objectif de poids et la date correspondante, dans user.target qui est un objet
  const targetWeight = !user.target.weight ? 0 : user.target.weight;
  const targetDate = !user.target.date
    ? "DD/MM/YYYY"
    : moment(user.target.date).format("Do MMM YYYY");

  // Liste de toutes les entrées de poids
  const weights = [...user.weight]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map((element, index) => (
      <View
        key={index}
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginBottom: 10,
        }}
      >
        <Text style={styles.text}>{element.weight} kg</Text>
        <Text style={styles.text}>
          {moment(element.date).format("Do MMM YYYY")}
        </Text>
      </View>
    ));

  // Logique pour décocher une case lorque une case est cochée
  const handleCheckbox = (name) => {
    if (name === "Loss") {
      setIsCheckedLoss(true);
      setIsCheckedGain(false);
    } else {
      setIsCheckedLoss(false);
      setIsCheckedGain(true);
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisibleWeight}
        onRequestClose={() => setModalVisibleWeight(!modalVisibleWeight)}
      >
        <KeyboardAvoidingView
          style={styles.modalBackground}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={[styles.modalView, { height: 300 }]}>
            <View style={styles.topModal}>
              <View style={styles.crossContainer}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={closeModalWeight}
                  accessibilityLabel="Fermer la modale"
                >
                  <FontAwesome
                    name={"times"}
                    size={30}
                    color={"white"}
                    style={styles.infoIcon}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.infoContainer}>
                <FontAwesome
                  name={"info-circle"}
                  size={25}
                  color={"#A3FD01"}
                  style={styles.infoIcon}
                />
                <Text style={styles.textInfo}>
                  Ajoutez votre poids pour le voir s'afficher sur le graphique
                  et suivre votre progression.
                </Text>
              </View>
            </View>
            <View style={styles.bottomModal}>
              <TextInput
                style={styles.input}
                placeholder="Ton poids"
                keyboardType="numeric"
                onChangeText={(value) => setWeight(value)}
                value={weight}
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
                onPress={handleAddWeight}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisibleTarget}
        onRequestClose={() => setModalVisibleTarget(!modalVisibleTarget)}
      >
        <KeyboardAvoidingView
          style={styles.modalBackground}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalView}>
            <View style={styles.topModal}>
              <View style={styles.crossContainer}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  accessibilityLabel="Fermer la modale"
                  onPress={closeModalTarget}
                >
                  <FontAwesome
                    name={"times"}
                    size={30}
                    color={"white"}
                    style={styles.infoIcon}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.infoContainer}>
                <FontAwesome
                  name={"info-circle"}
                  size={25}
                  color={"#A3FD01"}
                  style={styles.infoIcon}
                />
                <Text style={styles.textInfo}>
                  Définissez un objectif de poids et une date pour mieux suivre
                  votre progression
                </Text>
              </View>
            </View>
            <View style={styles.bottomModal}>
              <TextInput
                style={styles.input}
                placeholder={`Ton poids de départ`}
                keyboardType="numeric"
                onChangeText={(value) => setInitialWeighInput(value)}
                value={initialWeightInput}
              />
              <TextInput
                style={styles.input}
                placeholder="Ton objectif de poids"
                keyboardType="numeric"
                onChangeText={(value) => setWeightTarget(value)}
                value={weightTarget}
              />
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  marginBottom: 15,
                  alignItems: "center",
                }}
                onPress={showDatePicker}
              >
                <Text
                  style={{
                    color: "white",
                    borderColor: "white",
                    padding: 10,
                    borderWidth: 1,
                    borderRadius: 5,
                  }}
                >
                  {date
                    ? moment(date).format("DD/MM/YYYY")
                    : moment(new Date()).format("DD/MM/YYYY")}
                </Text>
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirmDate}
                  buttonTextColorIOS="black"
                  onCancel={hideDatePicker}
                  minimumDate={new Date()}
                />
              </TouchableOpacity>

              <View style={styles.checkboxWrapper}>
                <View style={styles.checkboxContainer}>
                  <TouchableOpacity
                    style={[
                      styles.checkbox,
                      {
                        backgroundColor: isCheckedLoss ? "#A3FD01" : "#D3D3D3",
                      },
                    ]}
                    onPress={() => handleCheckbox("Loss")}
                    activeOpacity={0.7}
                  >
                    {isCheckedLoss && <View style={styles.checkmark} />}
                  </TouchableOpacity>
                  <Text style={styles.text}>Objectif perte de poids</Text>
                </View>
                <View style={styles.checkboxContainer}>
                  <TouchableOpacity
                    style={[
                      styles.checkbox,
                      {
                        backgroundColor: isCheckedGain ? "#A3FD01" : "#D3D3D3",
                      },
                    ]}
                    onPress={() => handleCheckbox("Gain")}
                    activeOpacity={0.7}
                  >
                    {isCheckedGain && <View style={styles.checkmark} />}
                  </TouchableOpacity>
                  <Text style={styles.text}>Objectif gain de poids</Text>
                </View>
              </View>

              {error && <Text style={styles.errorText}>{errorMessage}</Text>}
              <Button
                textButton="Valider"
                textColor="#A3FD01"
                width={180}
                height={40}
                background="#272D34"
                borderWidth={1}
                borderColor="#A3FD01"
                onPress={addTargetWeight}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <View style={styles.topContainer}>
        <TouchableOpacity
          style={styles.backToContainer}
          onPress={() => navigation.navigate("Stats")}
          activeOpacity={0.7}
        >
          <FontAwesome name={"chevron-left"} size={24} color={"#3BC95F"} />
          <Text style={styles.backToText}>Statistiques</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Suivi de poids</Text>
      </View>
      <Text style={styles.nameTitle}>{user.username}</Text>
      <ScrollView style={styles.weightContainer}>
        <View style={styles.objectif}>
          <View style={styles.colunmContainer}>
            <View style={styles.colunm}>
              <Text style={styles.startTitle}>Début</Text>
              <Text style={styles.textWeight}>{startWeight} kg</Text>
              <Text style={styles.text}>{startDate}</Text>
            </View>
            <View style={styles.colunm}>
              <Text style={styles.startTitle}>Actuel</Text>

              <Progress.Circle
                progress={progressValue}
                animated={true}
                color="#A3FD01"
                unfilledColor="#0D0D36"
                borderWidth={0.2}
                size={100}
                showsText={false}
                strokeCap="round"
              />

              <View style={styles.textAbsolute}>
                <Text style={styles.textWeight}>{currentWeight} kg</Text>
              </View>

              <Text style={styles.text}>{currentDate}</Text>
            </View>
            <View style={styles.colunm}>
              <Text style={styles.startTitle}>
                Objectif{" "}
                {user.target.objectif && user.target.objectif === "Gain" ? (
                  <FontAwesome6
                    name={"arrow-trend-up"}
                    size={15}
                    color={"#3BC95F"}
                  />
                ) : (
                  user.target.objectif &&
                  user.target.objectif === "Loss" && (
                    <FontAwesome6
                      name={"arrow-trend-down"}
                      size={15}
                      color={"#3BC95F"}
                    />
                  )
                )}
              </Text>

              <Text style={styles.textWeight}>{targetWeight} kg</Text>
              <Text style={styles.text}>{targetDate}</Text>
            </View>
          </View>
        </View>
        <View style={styles.progress}>
          <Text style={styles.text}>Progression</Text>
          <Progress.Bar
            progress={progressValue}
            width={120}
            animated={true}
            color="#A3FD01"
            unfilledColor="#0D0D36"
          />
          <Text style={styles.text}>{progressValuePourcent} %</Text>
        </View>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.buttonContainer}
            activeOpacity={0.7}
            onPress={() => setModalVisibleWeight(!modalVisibleWeight)}
          >
            <Text style={styles.buttonText}>Ajouter mon poids</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonContainer}
            activeOpacity={0.7}
            onPress={() => setModalVisibleTarget(!modalVisibleTarget)}
          >
            <Text style={styles.buttonText}>Ajouter un objectif de poids</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.weightList}>
          <Text style={styles.weightListTitle}>Historique de Poids</Text>
          {weights}
        </View>
      </ScrollView>
      {showConfetti && (
        <ConfettiCannon
          count={50}
          origin={{ x: 0, y: 0 }}
          // autoStart={true}
          fadeOut={true}
          fallSpeed={2000}
        />
      )}

      {isLoading && (
        <View style={styles.backgroundLoading}>
          <ActivityIndicator size="large" color="#A3FD01" animating={true} />
        </View>
      )}
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
  //
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "85%",
    height: 470,
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
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 10,
  },
  bottomModal: {
    justifyContent: "center",
    alignItems: "center",
  },
  crossContainer: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 35,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  checkboxWrapper: {
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  errorText: {
    color: "#FF4500",
  },
  textInfo: {
    color: "white",
    fontSize: 12,
    marginLeft: 5,
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
  objectif: {
    borderBottomWidth: 1,
    marginBottom: 16,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
    height: 200,
  },
  colunmContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    height: "100%",
    paddingVertical: 10,
  },
  startTitle: {
    fontSize: 20,
    color: "#A3FD01",
  },
  colunm: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  textWeight: {
    color: "white",
    fontSize: 16,
  },
  text: {
    color: "white",
  },
  textAbsolute: {
    position: "absolute",
    justifyContent: "center",
    top: "48%",
    alignItems: "center",
  },
  progress: {
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
    marginBottom: 16,
    borderBottomWidth: 1,
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 16,
  },
  weightList: {
    marginBottom: 16,
  },
  buttonContainer: {
    width: "48%",
    backgroundColor: "#A3FD01",
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "black",
    fontSize: 14,
    fontWeight: 600,
    textAlign: "center",
  },
  buttonWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
    borderBottomWidth: 1,
    height: 70,
  },
  weightListTitle: {
    fontSize: 20,
    color: "#A3FD01",
    textAlign: "center",
    marginBottom: 15,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 5,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },
  checkmark: {
    width: 12,
    height: 12,
    backgroundColor: "#272D34",
    borderRadius: 2,
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
