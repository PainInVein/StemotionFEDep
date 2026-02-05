import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginService, logoutService, getMeService } from "../services/auth/auth.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Check session khi refresh trang (cookie-based)
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        // Lấy user từ localStorage (đã lưu khi login)
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);

          // (Optional) Validate cookie còn hạn không
          try {
            await getMeService();  // Nếu 200 OK → cookie còn hạn
          } catch {
            // 401 → Cookie hết hạn → Logout
            localStorage.removeItem('user');
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (e) {
        if (!alive) return;
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const login = async (email, password) => {
    // ✅ Login response đã có user info
    const data = await loginService(email, password);

    const userData = data?.result;
    if (userData) {
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    }

    throw new Error("Login thành công nhưng không nhận được thông tin user");
  };

  const logout = async () => {
    await logoutService(); // Clear cookie + localStorage
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
      loading,
      login,
      logout,
    }),
    [isAuthenticated, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
