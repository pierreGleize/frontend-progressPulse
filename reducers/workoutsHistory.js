import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const workoutsHistorySlice = createSlice({
  name: "workoutsHistory",
  initialState,
  reducers: {
    addWorkout: (state, action) => {
      state.value.push(action.payload);
      console.log(state.value);
    },
    addAllWorkoutsHistory: (state, action) => {
      if (action.payload) {
        state.value = action.payload;
      }
      console.log(state.value);
    },

    updateNameWorkoutHistory: (state, action) => {
      for (let workout of state.value) {
        // console.log(workout.workoutID, action.payload.workoutID);
        if (workout.workoutID === action.payload.workoutID) {
          workout.workoutName = action.payload.newName;
        }
      }
    },
    resetWorkoutsHistory: (state, action) => {
      state.value = [];
    },
  },
});

export const {
  addWorkout,
  addAllWorkoutsHistory,
  updateNameWorkoutHistory,
  resetWorkoutsHistory,
} = workoutsHistorySlice.actions;
export default workoutsHistorySlice.reducer;
