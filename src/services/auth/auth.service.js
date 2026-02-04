// import { loginApi, sendRegisterOtpApi, verifyRegisterOtpApi } from "../api/auth.api";

// export const loginService = async (email, password) => {
//   const res = await loginApi({ email, password });

//   const token = res.data?.result; // backend trả về "result"
//   if (!token) throw new Error("Missing token in response");

//   localStorage.setItem("access_token", token);
// //   localStorage.setItem("user", JSON.stringify(res.data.user)); 

//   return token; // hoặc return res.data nếu bạn muốn
// };

// export const logoutService = () => {
//   localStorage.removeItem("access_token");
// //   localStorage.removeItem("user");
// };

// // ✅ NEW: gửi OTP
// export const sendRegisterOtpService = async (payload) => {
//   const res = await sendRegisterOtpApi(payload);
//   return res.data;
// };

// // ✅ NEW: verify OTP (tuỳ BE cần payload gì)
// export const verifyRegisterOtpService = async (payload) => {
//   const res = await verifyRegisterOtpApi(payload);
//   return res.data;
// };

import {
  loginApi,
  // logoutApi, 
  // meApi,           
  sendRegisterOtpApi,
  verifyRegisterOtpApi,
} from "../api/auth.api";

// ✅ Cookie-based login (BE set cookie)
export const loginService = async (email, password) => {
  const res = await loginApi({ email, password });

  // ✅ Không set localStorage nữa
  // BE đã set cookie HttpOnly -> FE không đọc được token
  return res.data; // có thể là { user, message, ... } tuỳ BE
};

// ✅ Logout nên gọi BE để clear cookie
export const logoutService = async () => {
  try {
    await logoutApi(); // endpoint clear cookie (Set-Cookie expired)
  } finally {
    // Không cần remove localStorage token nữa vì không dùng
  }
};

// ✅ (Optional) Lấy thông tin user hiện tại từ cookie
export const getMeService = async () => {
  const res = await meApi(); // BE đọc cookie -> trả user
  return res.data;
};

// ✅ OTP
export const sendRegisterOtpService = async (payload) => {
  const res = await sendRegisterOtpApi(payload);
  return res.data;
};

export const verifyRegisterOtpService = async (payload) => {
  const res = await verifyRegisterOtpApi(payload);
  return res.data;
};
