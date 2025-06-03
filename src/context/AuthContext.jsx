// 1. Обновленный AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null); // Новое состояние для данных пользователя
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true); // Состояние загрузки

  // Функция для загрузки данных пользователя
  const fetchUserData = async () => {
    try {
      const { data } = await axios.get(`http://109.73.194.68:5050/profile/get_information`);
      setUserData(data);
    } catch (error) {
      console.error("Ошибка загрузки данных пользователя:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const decoded = jwtDecode(token);
          
          if (decoded.exp * 1000 < Date.now()) {
            logout();
          } else {
            setUser(decoded);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            
            // Загружаем данные пользователя по ID из токена
            await fetchUserData(decoded.user_id);
          }
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [token]);

  const login = async (credentials) => {
    try {
      const { data } = await axios.post("http://109.73.194.68:5050/auth/login", credentials);
      localStorage.setItem("token", data.access_token);
      setToken(data.access_token);
      const decoded = jwtDecode(data.access_token);
      setUser(decoded);
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.access_token}`;
      await fetchUserData(); // Загружаем данные после логина
    } catch (error) {
      throw error.response.data;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setUserData(null); // Очищаем данные при выходе
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userData,
      token, 
      loading,
      login, 
      logout,
      fetchUserData // Можно обновлять данные при необходимости
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);