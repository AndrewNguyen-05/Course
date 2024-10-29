import { createContext, useContext, useEffect, useState } from "react";
import { UseAuth } from "../service/Oauth2/UseAuth";
import { HandleLogout } from "../service/Oauth2/HandleLogout";
import { useWebsocket } from "../components/router/useWebSocket";
import { markAsReadNotification, notificationCurrentLogin } from "../service/NotificationService";
import { getAvatar } from "../service/ProfileService";
import { introspect } from "../service/AuthenticationService";
import { getPointsByCurrentLogin } from "../service/UserService";

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const token = localStorage.getItem("token");
  const [loggedOut, setLoggedOut] = useState(false);
  const { isTokenValid } = UseAuth({ loggedOut });
  const { handleLogout } = HandleLogout({ setLoggedOut });
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0); // Đếm số lượng thông báo chưa đọc
  const [points, setPoints] = useState(0);
  const [role, setRole] = useState(null);

  const wsClient = useWebsocket();

  useEffect(() => {
    wsClient.onConnect = () => {
      console.log("Connected to WebSocket");
      wsClient.subscribe("/user/queue/notifications", (message) => {
        const notification = JSON.parse(message.body);
        setNotifications((prevNotifications) => [
          notification,
          ...prevNotifications,
        ]);
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
        setNotifications(data.result || []);
        setUnreadCount(data.result.filter((n) => !n.isRead).length || []);
      })
      .catch((error) => console.log(error));
  }, [token, isTokenValid, loggedOut]);

  useEffect(() => {
    if (!token || loggedOut || !isTokenValid) {
      setLoading(false);
      return;
    }
    introspect(token)
      .then((data) => {
        if (data.valid) {
          setRole(data.scope);
        } else {
          console.error("Token không hợp lệ");
        }
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [token, loggedOut, isTokenValid]);

  useEffect(() => {
    if (!token || loggedOut || !isTokenValid) {
      setLoading(false);
      return;
    }
    getAvatar()
      .then((data) => setAvatar(data.result))
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [token, loggedOut, isTokenValid]);

  useEffect(() => {
    const fetchPoints = async () => {
      if (!token || loggedOut || !isTokenValid) {
        setLoading(false);
        return;
      }
      try {
        const data = await getPointsByCurrentLogin();
        setPoints(data.result.points);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPoints();
  }, [token, loggedOut, isTokenValid]);

  useEffect(() => {
    const fetchPoints = async () => {
      if (!token || loggedOut || !isTokenValid) {
        setLoading(false);
        return;
      }
      try {
        const data = await getPointsByCurrentLogin();
        setPoints(data.result.points);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPoints();
  }, [token, loggedOut, isTokenValid]);

  const markAsRead = async (notificationId) => {
    try {
      await markAsReadNotification(notificationId);
      setUnreadCount((prevCount) => prevCount - 1);
      setNotifications((prevNotifications) =>
        prevNotifications.map((n) =>
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
    } catch (error) {
      console.error("Lỗi khi đánh dấu thông báo là đã đọc:", error);
    }
  };

  const value = {
    avatar,
    points,
    notifications,
    unreadCount,
    role,
    loading,
    isTokenValid,
    handleLogout,
    markAsRead,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
};
