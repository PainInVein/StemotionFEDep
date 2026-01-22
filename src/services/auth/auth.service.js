import { loginApi, registerApi } from "../api/auth.api";

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

export const registerService = async (payload) => {
  const res = await registerApi(payload);
  return res.data;
};
