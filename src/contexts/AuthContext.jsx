import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginService, logoutService, getMeService } from "../services/auth/auth.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshMe = async () => {
    const me = await getMeService();
    const freshUser = me?.result;
    if (!freshUser) throw new Error("Không lấy được user từ /me");
    localStorage.setItem("user", JSON.stringify(freshUser));
    setUser(freshUser);
    setIsAuthenticated(true);
    return freshUser;
  };

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
        }

        await refreshMe();
      } catch {
        localStorage.removeItem("user");
        if (!alive) return;
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await loginService(email, password);
      const userData = data?.result;
      if (!userData) throw new Error("Login thành công nhưng không có user");
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutService();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({ isAuthenticated, user, loading, login, logout, refreshMe }),
    [isAuthenticated, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}