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
// import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
// import { loginService, logoutService, getMeService } from "../services/auth/auth.service";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // ✅ Check session khi refresh trang (cookie-based)
//   useEffect(() => {
//     let alive = true;

//     (async () => {
//       try {
//         const data = await getMeService(); // BE đọc cookie -> trả user
//         if (!alive) return;

//         setUser(data?.user ?? data ?? null);
//         setIsAuthenticated(true);
//       } catch (e) {
//         if (!alive) return;

//         setUser(null);
//         setIsAuthenticated(false);
//       } finally {
//         if (!alive) return;
//         setLoading(false);
//       }
//     })();

//     return () => {
//       alive = false;
//     };
//   }, []);

//   const login = async (email, password) => {
//     // ✅ loginService chỉ cần gọi /login, BE set cookie
//     const data = await loginService(email, password);

//     // Nếu BE trả user luôn thì dùng luôn, còn không thì gọi /me
//     let me = data?.user ?? null;
//     if (!me) {
//       try {
//         const meData = await getMeService();
//         me = meData?.user ?? meData ?? null;
//       } catch {
//         // nếu /me fail thì vẫn coi như chưa auth
//         setUser(null);
//         setIsAuthenticated(false);
//         throw new Error("Login thành công nhưng không lấy được thông tin user (/me).");
//       }
//     }

//     setUser(me);
//     setIsAuthenticated(true);
//     return me; // hoặc return data nếu bạn muốn
//   };

//   const logout = async () => {
//     await logoutService(); // BE clear cookie
//     setUser(null);
//     setIsAuthenticated(false);
//   };

//   const value = useMemo(
//     () => ({
//       isAuthenticated,
//       user,
//       loading,
//       login,
//       logout,
//       // tiện dùng:
//       // refreshMe: async () => { ... } // nếu bạn muốn
//     }),
//     [isAuthenticated, user, loading]
//   );

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export default function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
//   return ctx;
// }
