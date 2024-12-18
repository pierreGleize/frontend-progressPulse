import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const workoutsSlice = createSlice({
  name: "workouts",
  initialState,
  reducers: {
    addAllUserWorkouts: (state, action) => {
      // Exemple de l'action payload reçu [{séance1}, {séance2}]
      for (let seance of action.payload) {
        state.value.push(seance);
      }
    },

    addWorkout: (state, action) => {
      // Exemple de l'action payload reçu {séanceToAdd}
      state.value.push(action.payload);
    },

    removeWorkout: (state, action) => {
      // Exemple de l'action payload reçu 'nomDeSeanceASupprimer'
      state.value = state.value.filter(
        (seance) => seance._id !== action.payload
      );
    },
    removeExercise: (state, action) => {
      for (let workout of state.value) {
        if (workout._id === action.payload.workoutID) {
          workout.exercises = workout.exercises.filter(
            (exercise) => exercise.exercise._id !== action.payload.exerciseID
          );
        }
      }
    },

    updateExercises: (state, action) => {
      for (let workout of state.value) {
        if (workout._id === action.payload.workoutID) {
          workout.exercises = action.payload.exercisesToUpdate;
        }
      }
    },

    updateWorkoutSets: (state, action) => {
      // Exemple de l'action payload !
      // {workoutName: "nomSeanceAModifier", exerciseName: "nomExerciceAmodifier", customSets: [{weight:70, reps:8}, ...]}
      for (let workout of state.value) {
        if (workout._id === action.payload.workoutID) {
          for (let exercise of workout.exercises) {
            console.log(exercise.exercise._id);
            if (exercise.exercise._id == action.payload.exerciseID) {
              exercise.customSets = action.payload.customSets;
              exercise.rest = action.payload.rest;
            }
          }
        }
      }
    },

    removeAllWorkout: (state, action) => {
      state.value = [];
    },
  },
});

export const {
  addAllUserWorkouts,
  addWorkout,
  removeWorkout,
  updateWorkoutSets,
  removeExercise,
  updateWorkoutName,
  updateExercises,
} = workoutsSlice.actions;
export default workoutsSlice.reducer;
