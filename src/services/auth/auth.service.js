import {
  loginApi,
  logoutApi,
  meApi,
  sendRegisterOtpApi,
  verifyRegisterOtpApi,
  loginStudentApi,
  createStudentApi 
} from "../api/auth.api";

// ✅ Login - Backend trả user info trong response
export const loginService = async (email, password) => {
  const res = await loginApi({ email, password });

  if (res.data?.result) {
    const parentUser = { ...res.data.result, role: "parent" };
    localStorage.setItem("user", JSON.stringify(parentUser));
  }

  return res.data;
};

// ✅ Logout - clear localStorage
export const logoutService = async () => {
  try {
    await logoutApi();
  } finally {
    localStorage.removeItem('user');
    localStorage.removeItem('student');
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

// export const loginStudentService = async (username, password) => {
//   const res = await loginStudentApi({ username, password });

//   if (res.data?.result) {
//     localStorage.setItem("student", JSON.stringify(res.data.result));
//   }
//   return res.data;
// };

export const loginStudentService = async (username, password) => {
  const res = await loginStudentApi({ username, password });

  if (res.data?.result) {
    const studentUser = { ...res.data.result, role: "student" };
    localStorage.setItem("user", JSON.stringify(studentUser)); // ✅ quan trọng
    localStorage.setItem("student", JSON.stringify(res.data.result)); // optional
  }

  return res.data;
};

// ✅ Create student
export const createStudentService = async (payload) => {
  const res = await createStudentApi(payload);
  return res.data;
};