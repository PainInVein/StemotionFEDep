import axiosClient from "../../utils/axiosClient";

export const loginApi = (payload) => {
  return axiosClient.post("/login", payload);
};

export const registerApi = (payload) => {
  return axiosClient.post("/api/Users", payload);
}
