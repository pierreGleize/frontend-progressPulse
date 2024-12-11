import { createSlice } from '@reduxjs/toolkit';

const initialState = {
 value: [],
};

export const workoutsSlice= createSlice({
    name: 'workouts',
    initialState,
    reducers: {
      addAllUserWorkouts: (state, action) => {
      // Exemple de l'action payload reçu [{séance1}, {séance2}]
       for (let seance of action.payload){
           state.value.push(seance)
       }
      },
      addWorkout: (state,action) => {
          // Exemple de l'action payload reçu {séanceToAdd}
          state.value.push(action.payload)
          console.log(state.value[0].exercises)
      },
      removeWorkout: (state,action) =>{
      // Exemple de l'action payload reçu 'nomDeSeanceASupprimer'
          state.value.filter(seance => seance.name =! action.payload)
      },
      updateWorkoutSets: (state,action) => {
          // Exemple de l'action payload !
          // {workoutName: "nomSeanceAModifier", exerciseName: "nomExerciceAmodifier", customSets: [{weight:70, reps:8}, ...]}
          for (let seance of state.value){
              if (seance.name === action.payload.workoutName){
                  for (let exercice of seance.exercises){
                      if (exercice.exercise.name === action.payload.exerciseName){
                          exercice.customSets = action.payload.customSets
                      }
                  }
              }
          }
      }
    }
});
   
   export const { addAllUserWorkouts, addWorkout, removeWorkout, updateWorkoutSets} = workoutsSlice.actions;
   export default workoutsSlice.reducer;