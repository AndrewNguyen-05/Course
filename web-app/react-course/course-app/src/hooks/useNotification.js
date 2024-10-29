import { useEffect, useState } from "react";
import { markAsReadNotification, notificationCurrentLogin } from "../service/NotificationService";

export const useNotification = (wsClient, token, loggedOut, isTokenValid) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    wsClient.onConnect = () => {
      wsClient.subscribe("/user/queue/notifications", (message) => {
        const notification = JSON.parse(message.body);
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prevCount) => prevCount + 1);
      });
    };
  }, [wsClient]);

  useEffect(() => {
    if (!token || loggedOut || !isTokenValid) {
      setLoading(false);
      return;
    }

    notificationCurrentLogin()
      .then((data) => {
        const unread = data.result.filter((n) => !n.isRead).length;
        setNotifications(data.result || []);
        setUnreadCount(unread || 0);
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [token, loggedOut, isTokenValid]);

  const markAsRead = async (id) => {
    try {
      await markAsReadNotification(id);
      setUnreadCount((prevCount) => prevCount - 1);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Lỗi khi đánh dấu thông báo là đã đọc:", error);
    }
  };

  return { notifications, unreadCount, markAsRead, loading };
};
