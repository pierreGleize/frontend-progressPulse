import { createSlice } from '@reduxjs/toolkit';

const initialState = {
 value: {
	 user : null,
	 workout : null,
	 date : null,
	 note: null,
	 ressenti: null,
	 performances : []
	},
};

export const currentWorkoutSlice = createSlice({
  name: 'currentWorkout',
  initialState,
  reducers: {
    addWorkoutInformation : (state, action) => {
	    // Exemple de action payload {userID: 5z64fze56f4ze5f4, workoutID = zfe5f1ezf65zf1}
      state.value.user = action.payload.userToken;
      state.value.workout = action.payload.workoutID
      state.value.date = new Date().toISOString()
    },
    addExerciseSet: (state, action) => {
      // Exemple de l'action payload {exerciseID: z4gefz4fez4, weight: 50, reps: 10, rest: 90}
      const exerciseAlreadyAdded = state.value.performances.some(performance => performance.exercise === action.payload.exerciseID);
      if (exerciseAlreadyAdded){
	      state.value.performances.forEach(performance => {
		      if (performance.exercise === action.payload.exerciseID){
			      performance.sets.push({weight : action.payload.weight, reps : action.payload.reps, rest : action.payload.rest})
		      }
	      })
      } else {
	      state.value.performances.push({exercise: action.payload.exerciseID, sets:[{weight : action.payload.weight, reps : action.payload.reps, rest : action.payload.rest}]})
      }  
    },
    addRessenti: (state, action) => {
	    // Exemple de l'action payload {note : 5, ressenti: "super séance"}
      state.value.note = action.payload.note
      state.value.ressenti = action.payload.ressenti
    },
    resetCurrentWorkout : (state, action) => {
	    state.value = {
			 user : null,
				workout : null,
				date : null,
				note: null,
				ressenti: null,
				performances : []
			}
    }
  },
});

export const { addWorkoutInformation, addExerciseSet, addRessenti, resetCurrentWorkout } = currentWorkoutSlice.actions;
export default currentWorkoutSlice.reducer;