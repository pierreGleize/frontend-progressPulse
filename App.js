import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";

import SigninScreen from "./pages/SigninScreen";
import SignupScreen from "./pages/SignupScreen";
import HomeScreen from "./pages/HomeScreen";
import StatsScreen from "./pages/StatsScreen";
import SettingsScreen from "./pages/SettingsScreen";
import WorkoutTypeScreen from "./pages/WorkoutTypeScreen";
import WorkoutDifficultyScreen from "./pages/WorkoutDifficultyScreen";
import WorkoutChoiceScreen from "./pages/WorkoutChoiceScreen";
import WorkoutSummaryScreen from "./pages/WorkoutSummaryScreen";
import MuscleGroupScreen from "./pages/MuscleGroupScreen";
import ExercicesChoiceScreen from "./pages/ExercicesChoiceScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <LinearGradient
      colors={["#77778E", "#3D3D5C"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{ flex: 1 }}
    >
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size, focused }) => {
            let iconName = "";

            if (route.name === "Stats") {
              iconName = "bar-chart-o";
            } else if (route.name === "Home") {
              iconName = "home";
            } else if (route.name === "Settings") {
              iconName = "gears";
            }

            return <FontAwesome name={iconName} size={30} color={color} />;
          },
          tabBarActiveTintColor: "#A3FD01",
          tabBarInactiveTintColor: "#EBF2F4",
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "transparent",
            borderTopWidth: 0,
            height: 70,
          },
        })}
      >
        <Tab.Screen name="Stats" component={StatsScreen} />
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </LinearGradient>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Signin" component={SigninScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="TabNavigator" component={TabNavigator} />
        <Stack.Screen name="WorkoutType" component={WorkoutTypeScreen} />
        <Stack.Screen
          name="WorkoutDifficulty"
          component={WorkoutDifficultyScreen}
        />
        <Stack.Screen name="workoutChoice" component={WorkoutChoiceScreen} />
        <Stack.Screen name="workoutSummary" component={WorkoutSummaryScreen} />
        <Stack.Screen name="muscleGroup" component={MuscleGroupScreen} />
        <Stack.Screen
          name="exercicesChoices"
          component={ExercicesChoiceScreen}
        />
        {/* <Stack.Screen name="exercice" component={ExerciceScreen} />
        <Stack.Screen name="timer" component={TimerScreen} />
        <Stack.Screen name="workoutEnding" component={WorkoutEndingScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});