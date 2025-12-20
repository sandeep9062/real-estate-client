
// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { authApi } from "@/services/authApi";
import { propertiesApi } from "@/services/propertiesApi";
import { userApi } from "@/services/userApi";
import { contactApi } from "@/services/contactApi";
const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [propertiesApi.reducerPath]: propertiesApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      contactApi.middleware,
      propertiesApi.middleware,
      userApi.middleware
    ),
  devTools: process.env.NODE_ENV !== "production", // ✅ enable Redux DevTools in development
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
