import React, { useContext, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import AuthContext from "../../context/AuthContext.jsx";
import { useAuthData } from "../../hooks/useAuthData.js";
import { useNotification } from "../../hooks/useNotification.js";
import { useUserProfile } from "../../hooks/useUserProfile.js";
import avatarDefault from "../../img/avatar-default.jpg";
import { HandleLogout } from "../../service/Oauth2/HandleLogout.js";
import LoadingSpinner from "../../utils/LoadingSpinner.jsx";
import { Advertisement } from "../pages/Widgets/Advertisement.jsx";
import { Favorites } from "../pages/Widgets/Favorites.jsx";
import { NavigationMenu } from "../pages/Widgets/NavigationMenu.jsx";
import { NotificationDropdown } from "../pages/Widgets/NotificationDropdown.jsx";
import { ProfileDropdown } from "../pages/Widgets/ProfileDropdown.jsx";
import { useWebsocket } from "../router/useWebSocket.js";
import { ViewRevenue } from "../pages/Widgets/ViewRevenue.jsx";

export const Header = () => {
  const authContext = useContext(AuthContext);
  const location = useLocation();
  const underlineRef = useRef(null);
  const wsClient = useWebsocket();
  const { handleLogout } = HandleLogout();

  // Custom hook usage
  const { role, loading: authLoading } = useAuthData();
  const {
    notifications,
    unreadCount,
    markAsRead,
    loading: notificationLoading,
  } = useNotification(wsClient);
  const { avatar, points, loading: profileLoading } = useUserProfile();

  // Kiểm tra trạng thái loading
  const loading = authLoading || notificationLoading || profileLoading;

  useEffect(() => {
    const activeLink = document.querySelector(`.nav-item.active`);
    if (activeLink && underlineRef.current) {
      underlineRef.current.style.left = `${activeLink.offsetLeft}px`;
      underlineRef.current.style.width = `${activeLink.offsetWidth}px`;
    }
  }, [location.pathname]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="header-page">
      <div className="container-fluid p-0">
        <nav className="navbar navbar-expand-lg bg-white navbar-light py-3 py-lg-0 px-lg-5">
          <NavLink to="/home" className="navbar-brand ml-lg-3">
            <h1 className="m-0 text-uppercase text-primary rounded">
              <i className="fa fa-book-reader mr-3"></i>D-LEARNING
            </h1>
          </NavLink>

          <button
            type="button"
            className="navbar-toggler rounded"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse justify-content-between px-lg-3"
            id="navbarCollapse"
          >
            <NavigationMenu
              isActive={(path) => location.pathname === path}
              underlineRef={underlineRef}
            />

            <div className="navbar-nav ml-auto d-flex align-items-center">
              <div className="nav-item d-flex align-items-center mx-3">
                <span className="points-display text-primary">
                  <i className="fa fa-coins"></i> {points}
                </span>
              </div>

              <NotificationDropdown
                notifications={notifications}
                unreadCount={unreadCount}
                markAsRead={markAsRead}
              />
              <Advertisement />
              <Favorites role={role} />
              <ViewRevenue role={role} />
              <ProfileDropdown
                avatar={avatar || avatarDefault}
                isTokenValid={authContext.authenticated}
                role={role}
                handleLogout={handleLogout}
              />
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};
