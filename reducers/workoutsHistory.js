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
    }
  },
});

export const { addWorkout} = workoutsHistorySlice.actions;
export default workoutsHistorySlice.reducer;
