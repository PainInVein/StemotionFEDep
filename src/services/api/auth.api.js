import axiosClient from "../../utils/axiosClient";

export const loginApi = (payload) => {
  return axiosClient.post("/login", payload);
};
