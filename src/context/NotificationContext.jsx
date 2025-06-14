import React, { createContext, useContext, useState, useEffect } from "react";
import { markNotificationAsRead, clearAllNotifications, getAllNotifications } from "../api/notificationApi";
import { listenToForegroundMessages } from "../api/firebase";

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);



  const addNotification = (notification) => {
    setNotifications((prev) => {
      if (prev.find((n) => n.id === notification.id)) return prev;
      return [notification, ...prev];
    });
  };

  const loadNotifications = async () => {
    try {
      const res = await getAllNotifications();
      setNotifications(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error("Ошибка загрузки уведомлений", e);
      setNotifications([]);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  

  // Отметить уведомление прочитанным (и удалить из списка)
  const markAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (e) {
      console.error("Ошибка отметки уведомления как прочитанного", e);
    }
  };

  // Очистить все уведомления
  const clearNotifications = async () => {
    try {
      await clearAllNotifications();
      setNotifications([]);
    } catch (e) {
      console.error("Ошибка очистки уведомлений", e);
    }
  };

  useEffect(() => {
  listenToForegroundMessages(addNotification);
}, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        clearNotifications,
        loadNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
