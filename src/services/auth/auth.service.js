import { loginApi, sendRegisterOtpApi, verifyRegisterOtpApi } from "../api/auth.api";

export const loginService = async (email, password) => {
  const res = await loginApi({ email, password });

  const token = res.data?.result; // backend trả về "result"
  if (!token) throw new Error("Missing token in response");

  localStorage.setItem("access_token", token);
//   localStorage.setItem("user", JSON.stringify(res.data.user)); 

  return token; // hoặc return res.data nếu bạn muốn
};

export const logoutService = () => {
  localStorage.removeItem("access_token");
//   localStorage.removeItem("user");
};

// ✅ NEW: gửi OTP
export const sendRegisterOtpService = async (payload) => {
  const res = await sendRegisterOtpApi(payload);
  return res.data;
};

// ✅ NEW: verify OTP (tuỳ BE cần payload gì)
export const verifyRegisterOtpService = async (payload) => {
  const res = await verifyRegisterOtpApi(payload);
  return res.data;
};


//==================================

// // auth.service.js
// import { loginApi, registerApi, meApi, logoutApi } from "../api/auth.api";

// export const loginService = async (email, password) => {
//   const res = await loginApi({ email, password });

//   // ✅ Nếu backend set cookie rồi, bạn có thể return user/info tuỳ backend trả về
//   // Ví dụ: res.data.user hoặc res.data.result...
//   return res.data;
// };

// export const logoutService = async () => {
//   // ✅ nên có endpoint logout để clear cookie ở backend
//   try {
//     await logoutApi();
//   } catch (e) {
//     // không bắt buộc, tuỳ backend
//   }
// };

// export const getMeService = async () => {
//   const res = await meApi(); // backend đọc cookie -> trả thông tin user
//   return res.data;
// };

// export const registerService = async (payload) => {
//   const res = await registerApi(payload);
//   return res.data;
// };
