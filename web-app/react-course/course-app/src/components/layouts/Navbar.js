import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UseAuth } from '../authentication/UseAuth';
import { HandleLogout } from '../authentication/HandleLogout';
import { useEffect } from 'react';
import { ProfileDropdown } from '../common/ProfileDropdown';
import { NotificationDropdown } from '../common/NotificationDropdown';
import { Favorites } from '../common/Favorites';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';


export const Navbar = () => {

  const [loggedOut, setLoggedOut] = useState(false);
  const { isTokenValid } = UseAuth({ loggedOut });
  const { handleLogout } = HandleLogout({ setLoggedOut });

  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(true);
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  const [notifications, setNotifications] = useState([]); // Giá trị mặc định là một mảng rỗng

  const [unreadCount, setUnreadCount] = useState(0); // Đếm số lượng thông báo chưa đọc

  useEffect(() => {
    const socket = new SockJS(`http://localhost:8080/ws`);
    
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("Connected to WebSocket");
  
        stompClient.subscribe('/user/queue/notifications', (message) => {
          const notification = JSON.parse(message.body);
          console.log("Received notification: ", notification); 
          setNotifications((prevNotifications) => [notification, ...prevNotifications]);
          setUnreadCount((prevCount) => prevCount + 1);
        });
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame);
      },
      onWebSocketError: (event) => {
        console.error("WebSocket error:", event);
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
    if (!token || !isTokenValid) {
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
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch avatar');
        return response.json();
      })
      .then(data => {
        const urlAvatar = data.result;
        setAvatar(urlAvatar);
        setLoading(false);
      })
      .catch(error => {
        console.log('Error fetching avatar:', error);
        setLoading(false);
      });
  }, [token, isTokenValid]);

  return (
    <div>
      <div className="container-fluid p-0">
        <nav className="navbar navbar-expand-lg bg-white navbar-light py-3 py-lg-0 px-lg-5">
          <Link to="/" className="navbar-brand ml-lg-3">
            <h1 className="m-0 text-uppercase text-primary rounded">
              <i className="fa fa-book-reader mr-3"></i>D-LEARNING
            </h1>
          </Link>
          <button type="button" className="navbar-toggler rounded" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-between px-lg-3" id="navbarCollapse">
            <div className="navbar-nav mx-auto py-0">
              <Link to="/" className="nav-item nav-link active rounded">Home</Link>
              <Link to="/about" className="nav-item nav-link rounded">About</Link>
              <Link to="/courses" className="nav-item nav-link rounded">Courses</Link>
              <div className="nav-item dropdown rounded">
                <Link to="#" className="nav-link dropdown-toggle rounded" data-bs-toggle="dropdown">Pages</Link>
                <div className="dropdown-menu m-0 rounded">
                  <Link to="/course-detail" className="dropdown-item rounded">Course Detail</Link>
                  <Link to="/our-feature" className="dropdown-item rounded">Our Features</Link>
                  <Link to="/instructor" className="dropdown-item rounded">Instructors</Link>
                  <Link to="/testimonial" className="dropdown-item rounded">Testimonial</Link>
                </div>
              </div>
              <Link to="/contact" className="nav-item nav-link rounded">Contact</Link>
            </div>


            <NotificationDropdown
              notifications={notifications}
              unreadCount={unreadCount}
              markAsRead={markAsRead}
            />
             <Favorites />

            <ProfileDropdown
              avatar={avatar}
              isTokenValid={isTokenValid}
              role={role}
              handleLogout={handleLogout}
            />
          </div>
        </nav>
      </div>
    </div>
  );
};


