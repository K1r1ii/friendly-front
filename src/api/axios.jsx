import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.API_URL,
});

// Перехватчик для обработки 401 ошибки
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);