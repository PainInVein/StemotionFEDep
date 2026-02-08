import axiosClient from "../../utils/axiosClient";

export const loginApi = (payload) => {
  return axiosClient.post("/api/Auth/login", payload);
};

export const sendRegisterOtpApi = (payload) =>
  axiosClient.post("/api/Auth/register/send-otp", payload);

export const verifyRegisterOtpApi = (payload) =>
  axiosClient.post("/api/Auth/register/verify-otp", payload);

export const meApi = () => axiosClient.get("/api/Auth/me");

export const logoutApi = () => axiosClient.post("/api/Auth/logout");

