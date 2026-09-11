import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  image?: string;
  role: string;
  isActive?: boolean;
  isBanned?: boolean;
  favProperties: any[];
  favRoommateProfiles: any[];
  bookedVisits: any[];
  ownedProperties: any[];
  createdAt?: string;
  updatedAt?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  // Note: Token is NOT stored in Redux or localStorage
  // Tokens are stored in HTTP-only cookies for security
}

// Initial state - no token storage
// Authentication is handled via HTTP-only cookies
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(
      state,
      action: PayloadAction<{
        user: User;
      }>
    ) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      // Store only user info in localStorage (not tokens)
      try {
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("isAuthenticated", "true");
      } catch (e) {
        // ignore storage errors
      }
    },
    logoutSuccess(state) {
      state.isAuthenticated = false;
      state.user = null;
      try {
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
      } catch (e) {
        // ignore storage errors
      }
    },
    setUser(
      state,
      action: PayloadAction<{
        user: User;
      }>
    ) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      try {
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("isAuthenticated", "true");
      } catch (e) {
        // ignore storage errors
      }
    },
    updateUser(
      state,
      action: PayloadAction<Partial<User>>
    ) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        try {
          localStorage.setItem("user", JSON.stringify(state.user));
        } catch (e) {
          // ignore storage errors
        }
      }
    },
    clearAuth(state) {
      state.isAuthenticated = false;
      state.user = null;
      try {
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
      } catch (e) {
        // ignore storage errors
      }
    },
  },
});

export const { loginSuccess, logoutSuccess, setUser, updateUser, clearAuth } = authSlice.actions;

export default authSlice.reducer;

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectUser = (state: RootState) => state.auth.user;
export const selectUserRole = (state: RootState) => state.auth.user?.role;
export const selectIsAdmin = (state: RootState) => state.auth.user?.role === "admin";