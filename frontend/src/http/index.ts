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

let refreshTokenPromise: Promise<any> | null = null;
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error?.response?.status === 401 && originalRequest.url !== "/v1/auth/refresh-token") {
      if (!refreshTokenPromise) {
        refreshTokenPromise = instance
          .post(
            "/v1/auth/refresh-token",
            {},
            {
              withCredentials: true,
            }
          )
          .then((result) => {
            refreshTokenPromise = null;
            return result;
          });
      }

      return refreshTokenPromise
        .then((result) => {
          localStorage.setItem("accessToken", result.data.token);
          return instance(originalRequest);
        })
        .catch(() => {
          localStorage.removeItem("accessToken");
          window.location.replace("/login");
        });
    }

    return Promise.reject(error);
  }
);

export default instance;
