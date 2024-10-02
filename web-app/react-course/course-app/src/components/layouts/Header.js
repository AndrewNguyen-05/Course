import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { UseAuth } from '../authentication/UseAuth.js';
import { HandleLogout } from '../authentication/HandleLogout.js';
import { NotificationDropdown } from '../common/NotificationDropdown.js';
import { ProfileDropdown } from '../common/ProfileDropdown.js';
import { Favorites } from '../common/Favorites.js';
import { NavigationMenu } from '../common/NavigationMenu.js';
import { getAvatar } from '../../service/ProfileService.js';
import { introspect } from '../../service/AuthenticationService.js';
import { getPointsByCurrentLogin } from '../../service/UserService.js';
import { markAsReadNotification, notificationCurrentLogin } from '../../service/NotificationService.js';
import { Advertisement } from '../common/Advertisement.js';
import { Button, Form, FormControl } from 'react-bootstrap';

export const Header = () => {
    const [loggedOut, setLoggedOut] = useState(false);
    const { isTokenValid } = UseAuth({ loggedOut });
    const { handleLogout } = HandleLogout({ setLoggedOut });
    const location = useLocation();
    const underlineRef = useRef(null);
    const [avatar, setAvatar] = useState('');
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]); // Danh sách thông báo
    const [unreadCount, setUnreadCount] = useState(0); // Đếm số lượng thông báo chưa đọc
    const [points, setPoints] = useState(0);
    const [role, setRole] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const activeLink = document.querySelector(`.nav-item.active`);
        if (activeLink && underlineRef.current) {
            underlineRef.current.style.left = `${activeLink.offsetLeft}px`;
            underlineRef.current.style.width = `${activeLink.offsetWidth}px`;
        }
    }, [location.pathname]);

    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }
        introspect(token)
            .then(data => {
                if (data.result.valid) {
                    setRole(data.result.scope);
                } else {
                    console.error("Token không hợp lệ");
                }
            })
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
    }, [token]);


    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }
        getAvatar(token)
            .then(data => setAvatar(data.result))
            .catch(error => console.log(error));
    }, [token]);


    useEffect(() => {
        const fetchPoints = async () => {
            if (!token) return;
            try {
                const data = await getPointsByCurrentLogin(token);
                setPoints(data.result.points)
            } catch (error) {
                console.log(error)
            }
        };
        fetchPoints();
    }, [token])


    useEffect(() => {
        if (!token || !isTokenValid) return;

        notificationCurrentLogin(token)
            .then(data => {
                setNotifications(data.result || []);
                setUnreadCount(data.result.filter(n => !n.isRead).length || []);
            })
            .catch(error => console.log(error));
    }, [token, isTokenValid]);


    const markAsRead = async (notificationId) => {
        try {
            await markAsReadNotification(token, notificationId);
            setUnreadCount(prevCount => prevCount - 1);
            setNotifications(prevNotifications =>
                prevNotifications.map(n =>
                    n.id === notificationId ? { ...n, isRead: true } : n
                )
            );
        } catch (error) {
            console.error('Lỗi khi đánh dấu thông báo là đã đọc:', error);
        }
    };

    return (
        <div className="fixed-header">
            <div className="container-fluid p-0">
                <nav className="navbar navbar-expand-lg bg-white navbar-light py-3 py-lg-0 px-lg-5">
                    <NavLink to="/home" className="navbar-brand ml-lg-3">
                        <h1 className="m-0 text-uppercase text-primary rounded">
                            <i className="fa fa-book-reader mr-3"></i>D-LEARNING
                        </h1>
                    </NavLink>

                    <button type="button" className="navbar-toggler rounded" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-between px-lg-3" id="navbarCollapse">
                        <NavigationMenu isActive={isActive} underlineRef={underlineRef} />

                        <div className="navbar-nav ml-auto d-flex align-items-center">
                            {/* Hiển thị số điểm (Points) */}
                            <div className="nav-item d-flex align-items-center mx-3">
                                <span className="points-display text-primary">
                                    <i className="fa fa-coins"></i> {points} Points
                                </span>
                            </div>

                            <NotificationDropdown
                                notifications={notifications}
                                unreadCount={unreadCount}
                                markAsRead={markAsRead}
                            />
                            <Advertisement />
                            <Favorites />

                            <ProfileDropdown
                                avatar={avatar}
                                isTokenValid={isTokenValid}
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
