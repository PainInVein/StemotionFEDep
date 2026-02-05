import {
  loginApi,
  logoutApi,
  meApi,
  sendRegisterOtpApi,
  verifyRegisterOtpApi,
} from "../api/auth.api";

// ✅ Login - Backend trả user info trong response
export const loginService = async (email, password) => {
  const res = await loginApi({ email, password });

  // ✅ Backend trả: { message, isSuccess, result: userInfo }
  // Lưu vào localStorage
  if (res.data?.result) {
    localStorage.setItem('user', JSON.stringify(res.data.result));
  }

  return res.data;
};

// ✅ Logout - clear localStorage
export const logoutService = async () => {
  try {
    await logoutApi();
  } finally {
    localStorage.removeItem('user');
  }
};

// ✅ (Optional) Lấy thông tin user hiện tại từ cookie
export const getMeService = async () => {
  const res = await meApi();
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
