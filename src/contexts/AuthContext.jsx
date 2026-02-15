import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginService, logoutService, getMeService, loginStudentService } from "../services/auth/auth.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshMe = async () => {
    const me = await getMeService();
    // const freshUser = me;
    if (!me) {
      
      console.error("getMeService trả về dữ liệu không hợp lệ:", me);
      throw new Error("Không lấy được user từ /me");
    };

    // ✅ giữ role đã lưu trước đó (vì /me có thể không trả role)
    const savedRaw = localStorage.getItem("user");
    const savedUser = savedRaw ? JSON.parse(savedRaw) : null;

    const mergedUser = {
      ...me,
      role: me?.role || savedUser?.role, // giữ role cũ nếu thiếu
    };

    localStorage.setItem("user", JSON.stringify(mergedUser));
    console.log("refreshMe got user:", mergedUser);
    setUser(mergedUser);
    setIsAuthenticated(true);
    return mergedUser;
  };

  useEffect(() => {
  const savedRaw = localStorage.getItem("user");
  const savedUser = savedRaw ? JSON.parse(savedRaw) : null;

  if (savedUser) {
    setUser(savedUser);
    setIsAuthenticated(true);
  } else {
    setUser(null);
    setIsAuthenticated(false);
  }

  setLoading(false);
}, []);

  // ✅ Parent login (service đã set role + lưu localStorage rồi)
  const login = async (email, password) => {
    setLoading(true);
    try {
      await loginService(email, password);

      // ✅ Lấy user đã được service gắn role từ localStorage
      const savedRaw = localStorage.getItem("user");
      const savedUser = savedRaw ? JSON.parse(savedRaw) : null;

      if (!savedUser)
        throw new Error("Login thành công nhưng không có user trong localStorage");

      setUser(savedUser);
      setIsAuthenticated(true);
      return savedUser;
    } finally {
      setLoading(false);
    }
  };

  const loginStudent = async (username, password) => {
    setLoading(true);
    try {
      const data = await loginStudentService(username, password);
      const userData = data?.result;
      if (!userData) throw new Error("Login thành công nhưng không có user");
      // Add role to student user data
      const studentUser = { ...userData, role: "student" };
      localStorage.setItem("user", JSON.stringify(studentUser));
      setUser(studentUser);
      setIsAuthenticated(true);
      return studentUser;
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
    () => ({ isAuthenticated, user, loading, login, loginStudent, logout, refreshMe }),
    [isAuthenticated, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

// import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
// import { loginService, logoutService, getMeService, loginStudentService } from "../services/auth/auth.service";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const refreshMe = async () => {
//     const me = await getMeService();
//     const freshUser = me?.result;
//     if (!freshUser) throw new Error("Không lấy được user từ /me");

//     // ✅ giữ role đã lưu trước đó (vì /me có thể không trả role)
//     const savedRaw = localStorage.getItem("user");
//     const savedUser = savedRaw ? JSON.parse(savedRaw) : null;

//     const mergedUser = {
//       ...freshUser,
//       role: freshUser?.role || savedUser?.role, // giữ role cũ nếu thiếu
//     };

//     localStorage.setItem("user", JSON.stringify(mergedUser));
//     setUser(mergedUser);
//     setIsAuthenticated(true);
//     return mergedUser;
//   };

//   useEffect(() => {
//     let alive = true;

//     (async () => {
//       const savedUserRaw = localStorage.getItem("user");
//       const savedUser = savedUserRaw ? JSON.parse(savedUserRaw) : null;

//       if (savedUser) {
//         setUser(savedUser);
//         setIsAuthenticated(true);
//       }

//       // ✅ nếu là student thì khỏi gọi /me (vì student không dùng cookie /me)
//       if (savedUser?.role === "student") {
//         if (alive) setLoading(false);
//         return;
//       }

//       try {
//         await refreshMe();
//       } catch (e) {
//         console.error("refreshMe failed:", e);

//         // ✅ nếu refresh fail -> coi như chưa đăng nhập (tuỳ bạn muốn giữ savedUser hay không)
//         localStorage.removeItem("user");
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

//   // ✅ Parent login (service đã set role + lưu localStorage rồi)
//   const login = async (email, password) => {
//     setLoading(true);
//     try {
//       await loginService(email, password);

//       // ✅ Lấy user đã được service gắn role từ localStorage
//       const savedRaw = localStorage.getItem("user");
//       const savedUser = savedRaw ? JSON.parse(savedRaw) : null;

//       if (!savedUser)
//         throw new Error("Login thành công nhưng không có user trong localStorage");

//       setUser(savedUser);
//       setIsAuthenticated(true);
//       return savedUser;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loginStudent = async (username, password) => {
//     setLoading(true);
//     try {
//       const data = await loginStudentService(username, password);
//       const userData = data?.result;
//       if (!userData) throw new Error("Login thành công nhưng không có user");
//       // Add role to student user data
//       const studentUser = { ...userData, role: "student" };
//       localStorage.setItem("user", JSON.stringify(studentUser));
//       setUser(studentUser);
//       setIsAuthenticated(true);
//       return studentUser;
//     } finally {
//       setLoading(false);
//     }
//   };


//   const logout = async () => {
//     setLoading(true);
//     try {
//       await logoutService();
//       setUser(null);
//       setIsAuthenticated(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const value = useMemo(
//     () => ({ isAuthenticated, user, loading, login, loginStudent, logout, refreshMe }),
//     [isAuthenticated, user, loading]
//   );

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export default function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
//   return ctx;
// }