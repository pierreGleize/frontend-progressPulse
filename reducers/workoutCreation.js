import { createSlice } from '@reduxjs/toolkit';

const initialState = {
 value: {name: null, exercises: []},
};

export const workoutCreationSlice= createSlice({
 name: 'workoutCreation',
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
   },
   addAllExercise: (state, action) => {
    for(let exercices of action.payload){
      const exerciseToAdd = {
      exercice : exercices.exercice._id,
      exerciceName : exercices.exercice.name,
      muscleGroupe : exercices.exercice.muscleGroupe,
      rest : exercices.rest,
      customSets : exercices.sets
    }
      state.value.exercises.push(exerciseToAdd)
    }
   }
 }
});

export const { addExercise, addWorkoutName, resetWorkoutCreation, removeExercise, updateCustomSets, addAllExercise} = workoutCreationSlice.actions;
export default workoutCreationSlice.reducer;