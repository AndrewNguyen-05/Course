import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UseAuth } from '../../authentication/UseAuth';
import { HandleLogout } from '../../authentication/HandleLogout';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { NotificationDropdown } from '../../common/NotificationDropdown';

export const AdminHeader = () => {

    const [loggedOut, setLoggedOut] = useState(false);
    const { isTokenValid } = UseAuth({ loggedOut });
    const { handleLogout } = HandleLogout({ setLoggedOut });

    const location = useLocation();
    const underlineRef = useRef(null);
    const [avatar, setAvatar] = useState('');
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    const [notifications, setNotifications] = useState([]); // Danh sách thông báo
    const [unreadCount, setUnreadCount] = useState(0); // Đếm số lượng thông báo chưa đọc

    useEffect(() => {
        fetch(`http://localhost:8080/api/v1/notification-current`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(response => response.json())
            .then(data => {
                setNotifications(data.result);
                setUnreadCount(data.result.filter(n => !n.isRead).length);
            }).catch(error => console.log(error));
    }, []);


    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws'); // Tạo kết nối SockJS

        const stompClient = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log("Connected to WebSocket");
                stompClient.subscribe('/user/queue/notifications', (message) => {
                    const notification = JSON.parse(message.body);
                    setNotifications((prevNotifications) => [notification, ...prevNotifications]);
                    setUnreadCount((prevCount) => prevCount + 1);
                });
            },
            onDisconnect: () => {
                console.log("Disconnected from WebSocket");
            }
        });

        stompClient.activate();

        return () => {
            stompClient.deactivate();
        };
    }, []);

    const markAsRead = (notificationId) => {
        fetch(`http://localhost:8080/api/v1/is-read/${notificationId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(() => {
            setUnreadCount((prevCount) => prevCount - 1);
            setNotifications((prevNotifications) =>
                prevNotifications.map(n =>
                    n.id === notificationId ? { ...n, isRead: true } : n
                )
            );
        });
    };


    useEffect(() => {
        if (!role && !token) {
            setLoading(false);
            return;
        }

        if (token && !role) {
            fetch(`http://localhost:8080/api/v1/auth/introspect`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ token })
            }).then((response) => response.json()
            ).then(data => {
                console.log(data)
                localStorage.setItem('role', data.result.scope);
            }).catch(error => console.log(error))
        }
    }, [token])

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
        }).then(response => response.json()
        ).then(data => {
            console.log(data.result);
            const urlAvatar = data.result;
            setAvatar(urlAvatar);
        }).catch(error => console.log(error))
    }, [token]);

    useEffect(() => {
        const activeLink = document.querySelector(`.nav-item.active`);
        if (activeLink && underlineRef.current) {
            underlineRef.current.style.left = `${activeLink.offsetLeft}px`;
            underlineRef.current.style.width = `${activeLink.offsetWidth}px`;
        }
    }, [location.pathname]);

    const isActive = (path) => location.pathname === path;

    return (
        <div>
            <div className="container-fluid p-0">
                <nav className="navbar navbar-expand-lg bg-white navbar-light py-3 py-lg-0 px-lg-5">
                    <Link to="/home" className="navbar-brand ml-lg-3">
                        <h1 className="m-0 text-uppercase text-primary rounded">
                            <i className="fa-solid fa-gears"></i>
                        </h1>
                    </Link>
                    <button type="button" className="navbar-toggler rounded" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-between px-lg-3" id="navbarCollapse">
                        <div className="navbar-nav mx-auto py-0 position-relative">
                            <Link to="/home" className={`nav-item nav-link rounded ${isActive('/home') ? 'active' : ''}`}>Home</Link>
                            <Link to="/about" className={`nav-item nav-link rounded ${isActive('/about') ? 'active' : ''}`}>Revenue</Link>
                            <Link to="/courses" className={`nav-item nav-link rounded ${isActive('/courses') ? 'active' : ''}`}>Reports</Link>

                            <Link to="/contact" className={`nav-item nav-link rounded ${isActive('/contact') ? 'active' : ''}`}>Settings</Link>
                            <div className="underline" ref={underlineRef}></div>
                        </div>

                        <div className="navbar-nav ml-auto d-flex align-items-center">
                            {/* Nút thông báo */}
                            <NotificationDropdown
                                notifications={notifications}
                                unreadCount={unreadCount}
                                markAsRead={markAsRead}
                            />

                            {/* Nút tin nhắn */}
                            <div className="nav-item dropdown mx-2">
                                <button className="btn btn-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }} data-bs-toggle="dropdown">
                                    <i className="fa-solid fa-envelope"></i>
                                </button>

                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li className="dropdown-item">Message from Admin</li>
                                </ul>
                            </div>

                            {/* Nút Profile */}

                            <div className="nav-item dropdown mx-2">
                                <button className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center p-0" style={{ width: '50px', height: '50px', overflow: 'hidden' }} data-bs-toggle="dropdown" aria-expanded="false">
                                    {avatar ? (
                                        <img src={avatar} alt="User Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                    ) : (
                                        <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="User Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                    )}
                                </button>

                                <ul className="dropdown-menu dropdown-menu-end text-start" style={{ transform: 'translateX(-50%)', left: '50%' }}>
                                    {isTokenValid === null ? (
                                        <li></li> // Hiển thị khi đang kiểm tra token, không hiện gì

                                    ) : isTokenValid ? ( // nếu token đúng
                                        <>
                                            <li><Link to="/profile" className="dropdown-item d-flex align-items-center"><i className="fa-solid fa-address-card me-2"></i>Profile</Link></li>
                                            {role === 'TEACHER' && (
                                                <li><Link to="/manager-courses" className="dropdown-item d-flex align-items-center"><i className="fa-solid fa-book me-2"></i>My Course</Link></li>
                                            )}

                                            {role === 'USER' && (
                                                <li><Link to="/register-teacher" className="dropdown-item d-flex align-items-center"><i className="fa-solid fa-user-graduate me-2"></i>
                                                    Teach Now</Link></li>
                                            )}

                                            {role === 'ADMIN' && (
                                                <li><Link to="/admin" className="dropdown-item d-flex align-items-center"><i className="fa-solid fa-user-tie me-2"></i>Admin</Link></li>
                                            )}

                                            <li><Link to="/deposit" className="dropdown-item d-flex align-items-center"><i className="fa-brands fa-bitcoin me-2"></i>Deposit</Link></li>
                                            <li><Link to="/change-password" className="dropdown-item d-flex align-items-center"><i className="fa-solid fa-key me-2"></i>Password</Link></li>
                                            <li>
                                                <Link to="/logout" className="dropdown-item d-flex align-items-center" id="logout" onClick={handleLogout}>
                                                    <i className="fa-solid fa-sign-out-alt me-2"></i>Logout
                                                </Link>
                                            </li>
                                        </>
                                    ) : ( // token sai thì hiện Login
                                        <li>
                                            <Link to="/login" className="dropdown-item d-flex align-items-center" id="login">
                                                <i className="fa-solid fa-sign-in-alt me-2"></i>Login
                                            </Link>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    );
};
