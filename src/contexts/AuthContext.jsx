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

//==================================

// // AuthContext.jsx
// import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
// import { loginService, logoutService, getMeService } from "../services/auth/auth.service";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // ✅ Khi refresh trang: gọi /me để biết cookie còn hợp lệ không
//   useEffect(() => {
//     (async () => {
//       try {
//         const data = await getMeService();
//         setUser(data?.user ?? data);     // tuỳ backend trả về
//         setIsAuthenticated(true);
//       } catch (e) {
//         setUser(null);
//         setIsAuthenticated(false);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   const login = async (email, password) => {
//     const data = await loginService(email, password);
//     // sau login cookie đã set -> coi như authenticated
//     setIsAuthenticated(true);

//     // nếu backend trả user thì set luôn
//     setUser(data?.user ?? data ?? null);
//     return data;
//   };

//   const logout = async () => {
//     await logoutService();
//     setUser(null);
//     setIsAuthenticated(false);
//   };

//   const value = useMemo(
//     () => ({ isAuthenticated, user, loading, login, logout }),
//     [isAuthenticated, user, loading]
//   );

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export default function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
//   return ctx;
// }
