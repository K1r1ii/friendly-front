import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext"; // или .jsx — зависит от расширения
// ✅ Добавь этот импорт:
import { useNotifications } from "./context/NotificationContext";

import { ProtectedRoute } from "./components/ProtectedRoute";
import { requestPermissionAndToken } from "./api/firebase";
import { notifyAPI } from "./api/notify";

import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import News from "./pages/News";
import Register from './pages/Registration';
import CreateNews from './pages/CreateNews';
import UserFeed from './pages/UserFeed';

// 🔹 Вспомогательный компонент с логикой
const AppContent = () => {
  const { addNotification } = useNotifications(); // ✅ Теперь работает!

  useEffect(() => {
    const initNotifications = async () => {
      const token = await requestPermissionAndToken();
      if (token) {
        try {
          const response = await notifyAPI.connectToFirebase(token);
          console.log("✅ Токен отправлен на сервер:", response);

          listenToForegroundMessages(addNotification);
        } catch (error) {
          console.error("❌ Ошибка при отправке токена:", error);
        }
      }
    };

    initNotifications();
  }, [addNotification]);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Register />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/news"
          element={
            <ProtectedRoute>
              <News />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UserFeed />
            </ProtectedRoute>
          }
        />

        <Route
          path="/news/create_news"
          element={
            <ProtectedRoute>
              <CreateNews />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer companyName="Friendly" />
    </>
  );
};

// ✅ Оборачиваем всё правильно
function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <AuthProvider>
        <BrowserRouter>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;