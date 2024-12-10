import { createSlice } from '@reduxjs/toolkit';

const initialState = {
 value: {name: null, exercises: []},
};

export const workoutCreationSlice= createSlice({
 name: 'user',
 initialState,
 reducers: {
   addExercise: (state, action) => {
    state.value.exercises.push(action.payload) 
   },
   removeExercise: (state, action) => {
    state.value.exercises = state.value.exercises.filter(exercise => exercise.exercise != action.payload)
   },
   addWorkoutName: (state, action) => {
    state.value.name = action.payload
   },
   resetWorkoutCreation: (state, action) =>{
    state.value = {name: null, exercises: []}
   }
 }
});

export const { addExercise, addWorkoutName, resetWorkoutCreation, removeExercise} = workoutCreationSlice.actions;
export default workoutCreationSlice.reducer;