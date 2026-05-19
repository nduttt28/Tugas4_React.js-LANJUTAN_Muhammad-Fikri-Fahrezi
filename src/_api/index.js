import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8001/api",
});

// Tambahkan token otomatis ke setiap request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;