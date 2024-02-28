import axios from "axios";

const baseURL = "http://localhost:3000";

const instance = axios.create({
  baseURL,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

//TODO: add interceptor for response + refresh token mechanism

export default instance;
