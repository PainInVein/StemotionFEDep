import React, { createContext, useContext, useMemo, useState } from "react";
import { loginService, logoutService } from "../services/auth/auth.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("access_token"));

  const isAuthenticated = Boolean(token);

  const login = async (email, password) => {
    const t = await loginService(email, password); // loginService nên return token
    setToken(t);
    return t;
  };

  const logout = () => {
    logoutService();
    setToken(null);
  };

  const value = useMemo(
    () => ({ token, isAuthenticated, login, logout }),
    [token, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
