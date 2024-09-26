import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { UseAuth } from '../authentication/UseAuth.js';
import { HandleLogout } from '../authentication/HandleLogout.js';
import { NotificationDropdown } from '../common/NotificationDropdown.js';
import { ProfileDropdown } from '../common/ProfileDropdown.js';
import { Favorites } from '../common/Favorites.js';
import { Message } from '../common/Message.js';
import { NavigationMenu } from '../common/NavigationMenu.js';

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
        fetch(`http://localhost:8080/api/v1/auth/introspect`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ token })
        })
            .then((response) => response.json())
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
        if (!token || !isTokenValid) return;

        fetch(`http://localhost:8080/api/v1/notification-current`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setNotifications(data.result || []);
                setUnreadCount(data.result.filter(n => !n.isRead).length || []);
            })
            .catch(error => console.log(error));
    }, [token, isTokenValid]);

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        fetch(`http://localhost:8080/api/v1/get-avatar`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => setAvatar(data.result))
            .catch(error => console.log(error));
    }, [token]);

    useEffect(() => {
        const fetchPoints = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/get-points-user-current`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                if (!response.ok) {
                    throw new Error('Failed to get points');
                }
                const data = await response.json();
                setPoints(data.result.points)
            } catch (error) {
                console.log(error)
            }
        };
        fetchPoints();
    }, [token])

    const markAsRead = (notificationId) => {
        fetch(`http://localhost:8080/api/v1/is-read/${notificationId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(() => {
                setUnreadCount(prevCount => prevCount - 1);
                setNotifications(prevNotifications =>
                    prevNotifications.map(n =>
                        n.id === notificationId ? { ...n, isRead: true } : n
                    )
                );
            })
            .catch((error) => console.error('Error marking notification as read:', error));
    };

    return (
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
                        <Message />
                        <Favorites />
                        {/* Điều hướng dựa trên vai trò người dùng */}
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
    );
};
