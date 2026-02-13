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

  // useEffect(() => {
  //   let alive = true;

  //   (async () => {
  //     const savedUser = localStorage.getItem("user");
  //     if (savedUser) {
  //       setUser(JSON.parse(savedUser));
  //       setIsAuthenticated(true);
  //     }

  //     try {
  //       await refreshMe();
  //     } catch (e) {
  //       console.error("refreshMe failed:", e);
  //       // ✅ Nếu đã có savedUser thì giữ nguyên, đừng logout ngay
  //       if (!savedUser) {
  //         localStorage.removeItem("user");
  //         if (!alive) return;
  //         setUser(null);
  //         setIsAuthenticated(false);
  //       }
  //     } finally {
  //       if (!alive) return;
  //       setLoading(false);
  //     }
  //   })();

  //   return () => { alive = false; };
  // }, []);

  useEffect(() => {
    let alive = true;

    (async () => {
      const savedUserRaw = localStorage.getItem("user");
      const savedUser = savedUserRaw ? JSON.parse(savedUserRaw) : null;

      if (savedUser) {
        setUser(savedUser);
        setIsAuthenticated(true);
      }

      // ✅ nếu là student thì khỏi gọi /me
      if (savedUser?.role === "student") {
        if (alive) setLoading(false);
        return;
      }

      try {
        await refreshMe();
      } catch (e) {
        console.error("refreshMe failed:", e);
        // if (!savedUser) {
        //   localStorage.removeItem("user");
        //   if (!alive) return;
        //   setUser(null);
        //   setIsAuthenticated(false);
        // }
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
      localStorage.setItem("user", JSON.stringify(userData));
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