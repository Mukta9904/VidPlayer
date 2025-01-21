
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  user: {
  fullName: string,
  avatar: string,
  username: string,
  _id: string,
  watchHistory?: string[],
  email: string,
  coverImage?: string
} | null
}

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState["user"]>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
