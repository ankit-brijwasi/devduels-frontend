import { createSlice } from "@reduxjs/toolkit";

function getInitialState() {
  let local_user = localStorage.getItem("user");
  if (local_user) {
    local_user = JSON.parse(local_user);
    return {
      _id: local_user._id,
      username: local_user.username,
    };
  }
  return {
    _id: null,
    username: null,
  };
}

export const userSlice = createSlice({
  name: "user",
  initialState: getInitialState(),
  reducers: {
    setUser: (state, action) => {
      state._id = action.payload._id;
      state.username = action.payload.username;

      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: action.payload._id,
          username: action.payload.username,
        })
      );
    },
    rmUser: (state, action) => {
      state._id = null;
      state.username = null;

      localStorage.removeItem("user");
    },
  },
});

export const { setUser, getUser, rmUser } = userSlice.actions;
export default userSlice.reducer;
