import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type User = {
  id?: number;
  name: string;
  email: string;
  role?: string;
  address?: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
};

const savedUser = localStorage.getItem("user");

const initialState: AuthState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  token: localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        user: User;
        token: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;

      // ✅ save user also
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);

      if (action.payload.user.role) {
        localStorage.setItem("role", action.payload.user.role);
      }
    },

    logout: (state) => {
      state.user = null;
      state.token = null;

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;