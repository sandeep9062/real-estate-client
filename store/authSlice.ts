import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface AuthState {
  isAuthenticated: boolean;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    image?: string;
    role: string;
    favProperties: any[];
    bookedVisits: any[];
    ownedProperties: any[];
  } | null;
  token: string | null;
}

// Simple initial state - localStorage access moved to StoreProvider
// This prevents SSR/hydration issues with Next.js
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(
      state,
      action: PayloadAction<{
        user: {
          _id: string;
          name: string;
          email: string;
          phone: string;
          image?: string;
          role: string;
          favProperties: any[];
          bookedVisits: any[];
          ownedProperties: any[];
        };
        token: string;
      }>
    ) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
    logoutSuccess(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    setUser(
      state,
      action: PayloadAction<{
        user: {
          _id: string;
          name: string;
          email: string;
          phone: string;
          image?: string;
          role: string;
          favProperties: any[];
          bookedVisits: any[];
          ownedProperties: any[];
        };
        token: string;
      }>
    ) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      try {
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      } catch (e) {
        // ignore storage errors
      }
    },
  },
});

export const { loginSuccess, logoutSuccess, setUser } = authSlice.actions;

export default authSlice.reducer;

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;
