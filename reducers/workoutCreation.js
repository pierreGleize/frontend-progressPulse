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
    console.log(action.payload)
    state.value.exercises = state.value.exercises.filter(exercise => exercise.exercise != action.payload)
   },
   updateCustomSets: (state, action) => {
    console.log(action.payload.exerciseID)
    for (let exercise of state.value.exercises){
      if (exercise.exercise === action.payload.exerciseID){
        exercise.customSets = action.payload.newSets
        exercise.rest = action.payload.rest
      }
    }
   },
   addWorkoutName: (state, action) => {
    state.value.name = action.payload
   },
   resetWorkoutCreation: (state, action) =>{
    state.value = {name: null, exercises: []}
   }
 }
});

export const { addExercise, addWorkoutName, resetWorkoutCreation, removeExercise, updateCustomSets} = workoutCreationSlice.actions;
export default workoutCreationSlice.reducer;