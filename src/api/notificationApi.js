import axios from "axios";
export const getAllNotifications = () => {
  return axios.get("/notify/notifications");
};

export const markNotificationAsRead = (notificationId) => {
  return axios.patch(`/notify/mark-notify-read/${notificationId}`);
};

export const clearAllNotifications = () => {
  return axios.delete("/notify/clear-notifications");
};