import React from 'react';
import moment from 'moment';

export const NotificationDropdown = ({ notifications = [], unreadCount = 0, markAsRead }) => {
    // Hàm định dạng thời gian theo kiểu "time ago"
    const timeAgo = (createdAt) => {
        return moment(createdAt).fromNow();
    };

    return (
        <div className="nav-item dropdown mx-2 position-relative">
            <button
                className="btn btn-light rounded-circle d-flex align-items-center justify-content-center position-relative"
                style={{ width: '40px', height: '40px' }}
                data-bs-toggle="dropdown"
            >
                <i className="fa-solid fa-bell"></i>
                {unreadCount > 0 && (
                    <span className="badge bg-danger position-absolute top-0 start-100 translate-middle p-1 rounded-circle" style={{ fontSize: '12px' }}>
                        {unreadCount}
                    </span>
                )}
            </button>
            <ul className="dropdown-menu dropdown-menu-end p-3 notification-dropdown shadow-lg">
                {notifications.length === 0 ? (
                    <li className="dropdown-item text-center text-muted">No new notifications</li>
                ) : (
                    notifications.map((notification) => (
                        <li key={notification.id} 
                            className={`notification-item ${notification.isRead ? 'read' : 'unread'}`} 
                            style={{ padding: '10px 0', borderBottom: '1px solid #ddd' }}
                        >
                            <img 
                                src={notification.avatarUrl || "https://bootdey.com/img/Content/avatar/avatar7.png"} 
                                alt="Sender Avatar" 
                                className="rounded-circle me-3" 
                                style={{ width: '45px', height: '45px' }} 
                            />
                            <div>
                                <h6 style={{ fontWeight: notification.isRead ? 'normal' : 'bold' }}>
                                    {notification.title}
                                </h6>
                                <small className="text-muted d-block mb-1">{timeAgo(notification.createdAt)}</small>
                                <button 
                                    className="btn btn-sm btn-link" 
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <i className="fa fa-check-circle"></i> Mark as read
                                </button>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};
