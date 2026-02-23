"use client";
import { useEffect } from "react";
import { Provider } from "react-redux";
import store from "./store";
import { setUser } from "./authSlice";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Restore user from localStorage on app load
    // Note: Tokens are stored in HTTP-only cookies, not localStorage
    try {
      const user = localStorage.getItem("user");
      const isAuthenticated = localStorage.getItem("isAuthenticated");

      if (user && isAuthenticated === "true") {
        store.dispatch(setUser({ user: JSON.parse(user) }));
      }
    } catch (e) {
      // localStorage not available (SSR or privacy mode)
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
