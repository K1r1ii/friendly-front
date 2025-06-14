import axios from "axios";

const api = axios.create({
  baseURL: "http://109.73.194.68:5050",
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const logError = (message, data) => {
  console.error(message, data || "");
};

const logWarning = (message, data) => {
  console.warn(message, data || "");
};

export const notifyAPI = {
  connectToFirebase: async (deviceToken) => {
    const payload = { device_token: deviceToken };
    console.log("deviceToken:", deviceToken);
    console.log("📦 Payload to backend:", payload);

    try {
      const response = await api.post("/notify/connect-to-firebase", payload);
      console.log("✅ Ответ от сервера:", response.data);
      return response.data;
    } catch (error) {
      const errorData = error.response?.data || {};

      // Обрабатываем ошибку дубликата по тексту из ответа
      if (error.response?.status === 400 && errorData.detail?.includes('already stored')) {
        logWarning("⚠️ Токен уже зарегистрирован на сервере, игнорируем ошибку", errorData);
        return errorData; // Можно вернуть ошибку, чтобы код выше понимал, что это не критично
      }

      logError("❌ Ошибка при отправке токена:", errorData);
      throw error; // Остальные ошибки пробрасываем
    }
  },
};