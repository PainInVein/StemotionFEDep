import axiosClient from "../../utils/axiosClient";

export const loginApi = (payload) => {
  return axiosClient.post("/login", payload);
};

// ✅ Bước 1: gửi OTP khi đăng ký
export const sendRegisterOtpApi = (payload) =>
  axiosClient.post("/api/Auth/register/send-otp", payload);

// ✅ Bước 2: verify OTP (bạn đổi path đúng theo BE của bạn)
export const verifyRegisterOtpApi = (payload) =>
  axiosClient.post("/api/Auth/register/verify-otp", payload);

//==================================

// auth.api.js
// import axiosClient from "../../utils/axiosClient";

// export const loginApi = (payload) => axiosClient.post("/login", payload);

// export const registerApi = (payload) => axiosClient.post("/api/Users", payload);

// // ✅ cookie-auth thường cần endpoint check session
// export const meApi = () => axiosClient.get("/me"); // hoặc /auth/me

// // ✅ logout để backend clear cookie
// export const logoutApi = () => axiosClient.post("/logout"); // hoặc /auth/logout
