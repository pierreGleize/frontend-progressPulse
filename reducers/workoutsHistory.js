import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const workoutsHistorySlice = createSlice({
  name: "workoutsHistory",
  initialState,
  reducers: {
    addWorkout: (state, action) => {
      state.value.push(action.payload)
      console.log(state.value)
    },
    addAllWorkoutsHistory : (state, action) => {
      if (action.payload){
        state.value = action.payload
      }
      console.log(state.value)
    }
  },
});

export const { addWorkout, addAllWorkoutsHistory} = workoutsHistorySlice.actions;
export default workoutsHistorySlice.reducer;
