import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext"; // или .jsx — зависит от расширения
// ✅ Добавь этот импорт:
import { useNotifications } from "./context/NotificationContext";
import { listenToForegroundMessages } from "./api/firebase";

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
import Friends from './pages/Friends';
import UserFeed from './pages/UserFeed';

// 🔹 Вспомогательный компонент с логикой
const AppContent = () => {
  console.log('Inside AppContent'); // ✅ Должен сработать
  const { userData } = useAuth(); // ✅ Правильно — внутри функционального компонента
  const { addNotification, loadNotifications } = useNotifications(); // ✅ Также верно
  const [firebaseRegistered, setFirebaseRegistered] = React.useState(
    () => localStorage.getItem("firebaseRegistered") === "true"
  );

  useEffect(() => {
    if (userData) {
      loadNotifications();
    }
  }, [userData]);


  useEffect(() => {
      const initNotifications = async () => {
        if (!userData || firebaseRegistered) return;

       const token = await requestPermissionAndToken();
       if (token) {
         try {
           const response = await notifyAPI.connectToFirebase(token);
           console.log("✅ Токен отправлен на сервер:", response);
          // помечаем, что регистрация прошла
           localStorage.setItem("firebaseRegistered", "true");
           localStorage.getItem("firebaseRegistered");
           setFirebaseRegistered(true);
           listenToForegroundMessages(addNotification);
         } catch (error) {
           if (error.response?.data?.detail?.includes("already stored")) {
            localStorage.setItem("firebaseRegistered", "true");
            setFirebaseRegistered(true);
            listenToForegroundMessages(addNotification);
          } else {
            console.error("Ошибка отправки токена:", error.message);
           }
         }
       }
     };
     initNotifications();;
  }, [addNotification, userData, firebaseRegistered]);              //Если не будет работать убрать из квадратный скобок

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

        <Route
          path="/friends"
          element={
            <ProtectedRoute>
              <Friends />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer companyName="Friendly" />
    </>
  );
};

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