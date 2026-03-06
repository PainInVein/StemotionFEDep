import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginService, logoutService, getMeService, loginStudentService } from "../services/auth/auth.service";
import { getPaymentService } from "../services/subscription/subscription.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshMe = async () => {
    const response = await getMeService();
    const me = response?.result;

    if (!me) {
      console.error("getMeService trả về dữ liệu không hợp lệ:", response);
      throw new Error("Không lấy được user từ /me");
    }

    const savedRaw = localStorage.getItem("user");
    const savedUser = savedRaw ? JSON.parse(savedRaw) : null;
    const googleLoginRole = sessionStorage.getItem("googleLoginRole");

    const mergedUser = {
      ...savedUser,
      ...me,
      role: me?.role || savedUser?.role || googleLoginRole,
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

      const parentId = userData?.parentId;
      if (!parentId) throw new Error("Không tìm thấy parentId để kiểm tra thanh toán");

      // ✅ Check payment của parent
      const hasPaid = await getPaymentService(parentId); // true/false

      const studentUser = {
        ...userData,
        role: "student",
        parentPaid: hasPaid,      // ✅ gắn cờ
        parentId: parentId,
      };

      localStorage.setItem("user", JSON.stringify(studentUser));
      setUser(studentUser);
      setIsAuthenticated(true);

      // ✅ trả luôn kết quả để UI quyết định navigate hay chặn
      return studentUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutService();
      localStorage.removeItem("user");
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
