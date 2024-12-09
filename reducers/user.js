import { createSlice } from '@reduxjs/toolkit';

const initialState = {
 value: {token: null, username: null, email: null, sound: null, weight: []},
};

export const userSlice= createSlice({
 name: 'user',
 initialState,
 reducers: {
   login: (state, action) => {
    state.value.token = action.payload.token
    state.value.username= action.payload.username
    state.value.email= action.payload.email
    state.value.sound= action.payload.sound
   },
   logout: (state, action) => {
    state.value = {token: null, username: null, email: null, sound: null, seances: []}
    },
	changeSound: (state, action) => {
	    state.value.sound = action.payload.sound
	},
	addWeight: (state, action) => {
	    state.value.weight.push(action.payload)
	},
 }
});

export const { login, logout, changeSound, addWeight} = userSlice.actions;
export default userSlice.reducer;