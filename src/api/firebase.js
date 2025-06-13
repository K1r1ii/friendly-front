// firebase.js

import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Конфигурация Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAXe8Kk7SRMvKrlTy0TYfHx5Y27WEB5K_Q",
  authDomain: "friendly-fcm.firebaseapp.com",
  projectId: "friendly-fcm",
  storageBucket: "friendly-fcm.firebasestorage.app",
  messagingSenderId: "G-M35YCWXMNT",
  appId: "1:210160059112:web:aabd4d562c67c24e54ff5d",
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Запрос разрешения и получение FCM токена
export const requestPermissionAndToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Разрешение на уведомления не получено");
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: "BMjdHGiu8fNX87XIMJhx1EEdpipIAHbTMn1-Szkh1yW-hMjYbfkuqMQda9r7Mj4pHFHLX_gSnVRmni_xSUBcXI0",
    });

    console.log("Получен FCM токен:", token);
    return token;
  } catch (error) {
    console.error("Ошибка при получении разрешения или токена:", error);
    return null;
  }
};

// Функция для обработки сообщений в foreground (когда вкладка открыта)
export const listenToForegroundMessages = (onNewNotification) => {
  onMessage(messaging, (payload) => {
    console.log("📩 Получено уведомление:", payload);

    const notification = {
      id: payload.data?.id || Date.now(), // ✅ Уникальный ID
      title: payload.notification.title,
      body: payload.notification.body,
      type: payload.data.type,
      senderId: payload.data.sender_id,
      receivedAt: new Date().toISOString()
    };

    // Добавляем в контекст
    onNewNotification(notification);

    // Опционально: показываем native уведомление
    if (Notification.permission === "granted") {
      new Notification(notification.title, { body: notification.body });
    }
  });
};