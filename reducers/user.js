import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    token: null,
    username: null,
    email: null,
    sound: null,
    weight: [],
    target: {},
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.value.token = action.payload.token;
      state.value.username = action.payload.username;
      state.value.email = action.payload.email;
      state.value.sound = action.payload.sound;
      state.value.weight = action.payload.weight;
      state.value.target = action.payload.target;
    },
    logout: (state, action) => {
      state.value = {
        token: null,
        username: null,
        email: null,
        sound: null,
        seances: [],
        weight: [],
        target: {},
      };
    },
    changeSound: (state, action) => {
      state.value.sound = action.payload;
    },
    addWeight: (state, action) => {
      state.value.weight.push(action.payload);
    },
    updateEmail: (state, action) => {
      state.value.email = action.payload;
    },
    updateUsername: (state, action) => {
      state.value.username = action.payload;
    },
    updateTarget: (state, action) => {
      console.log(action);
      state.value.target = action.payload;
    },
  },
});

export const {
  login,
  logout,
  changeSound,
  addWeight,
  updateEmail,
  updateTarget,
  updateUsername,
} = userSlice.actions;
export default userSlice.reducer;
