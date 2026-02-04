// import axios from "axios";

// const axiosClient = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL,
//   headers: { "Content-Type": "application/json" },
// });

// axiosClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem("access_token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// export default axiosClient;

//==================================
import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
  withCredentials: true,
});

export default axiosClient;
