import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UseAuth } from '../authentication/UseAuth.js';
import { HandleLogout } from '../authentication/HandleLogout.js';
import { NotificationDropdown } from '../common/NotificationDropdown.js';
import { ProfileDropdown } from '../common/ProfileDropdown.js';
import { Favorites } from '../common/Favorites.js';
import { Message } from '../common/Message.js';
import { Card } from '../common/Cart.js';
import { NavigationMenu } from '../common/NavigationMenu.js';
import { TopBar } from '../common/TopBar.js';


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

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    // useEffect(() => {
    //     const socket = new SockJS(`http://localhost:8080/ws`);
        
    //     const stompClient = new Client({
    //       webSocketFactory: () => socket,
    //       onConnect: () => {
    //         console.log("Connected to WebSocket");
      
    //         stompClient.subscribe('/user/queue/notifications', (message) => {
    //           const notification = JSON.parse(message.body);
    //           console.log("Received notification: ", notification); 
    //           setNotifications((prevNotifications) => [notification, ...prevNotifications]);
    //           setUnreadCount((prevCount) => prevCount + 1);
    //         });
    //       },
    //       onStompError: (frame) => {
    //         console.error("STOMP error:", frame);
    //       },
    //       onWebSocketError: (event) => {
    //         console.error("WebSocket error:", event);
    //       },
    //       onDisconnect: () => {
    //         console.log("Disconnected from WebSocket");
    //       }
    //     });
      
    //     stompClient.activate();
      
    //     return () => {
    //       stompClient.deactivate();
    //     };
    //   }, []);
      
      
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
        if (!token || isTokenValid) {
          return;
        }
        fetch(`http://localhost:8080/api/v1/notification-current`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
          .then(response => response.json())
          .then(data => {
            setNotifications(data.result || []);
            setUnreadCount(data.result.filter(n => !n.isRead).length || []);
          })
          .catch(error => console.log(error));
      }, [token, isTokenValid]);
      
      
    const markAsRead = (notificationId) => {
        fetch(`http://localhost:8080/api/v1/is-read/${notificationId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to mark as read');
                }
                return response.json();
            })
            .then(() => {
                setUnreadCount((prevCount) => prevCount - 1);
                setNotifications((prevNotifications) =>
                    prevNotifications.map((n) =>
                        n.id === notificationId ? { ...n, isRead: true } : n
                    )
                );
            })
            .catch((error) => console.error('Error marking notification as read:', error));
    };

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
            <TopBar />
            <div className="container-fluid p-0">
                <nav className="navbar navbar-expand-lg bg-white navbar-light py-3 py-lg-0 px-lg-5">
                    <Link to="/home" className="navbar-brand ml-lg-3">
                        <h1 className="m-0 text-uppercase text-primary rounded">
                            <i className="fa fa-book-reader mr-3"></i>D-LEARNING
                        </h1>
                    </Link>
                    <button type="button" className="navbar-toggler rounded" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-between px-lg-3" id="navbarCollapse">
                        <NavigationMenu isActive={isActive} underlineRef={underlineRef} />

                        <div className="navbar-nav ml-auto d-flex align-items-center">
                            <NotificationDropdown
                                notifications={notifications}
                                unreadCount={unreadCount}
                                markAsRead={markAsRead}
                            />
                            <Card />
                            <Message />
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
            {/* Navbar End */}

            {/* Header Start */}
            <div className="jumbotron jumbotron-fluid position-relative overlay-bottom" style={{ marginBottom: '90px' }}>
                <div className="container text-center my-5 py-5">
                    <h1 className="text-white mt-4 mb-4">Learn From Home</h1>
                    <h1 className="text-white display-1 mb-5">Education Courses</h1>
                    <div className="mx-auto mb-5" style={{ width: '100%', maxWidth: '600px' }}>
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <button className="btn btn-outline-light bg-white text-body px-4 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Courses
                                </button>
                                <div className="dropdown-menu">
                                    <a className="dropdown-item" href="#">Courses 1</a>
                                    <a className="dropdown-item" href="#">Courses 2</a>
                                    <a className="dropdown-item" href="#">Courses 3</a>
                                </div>
                            </div>
                            <input type="text" className="form-control border-light" style={{ padding: '30px 25px' }} placeholder="Keyword" />
                            <div className="input-group-append">
                                <button style={{ backgroundColor: '#F14D5D', borderColor: '#F14D5D', color: '#FFFFFF' }}
                                    className="btn btn-secondary px-4 px-lg-5">
                                    Search

                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Header End */}
        </div>
    );
};
