import React from 'react';

export const NotificationDropdown = () => {
    return (
        <div className="nav-item dropdown mx-2">
            <button className="btn btn-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }} data-bs-toggle="dropdown">
                <i className="fa-solid fa-bell"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end p-3" style={{ minWidth: '300px', maxWidth: '350px' }}>
                <li className="dropdown-item d-flex align-items-start">
                    <img src="https://via.placeholder.com/50" alt="Notification 1" className="rounded me-2" style={{ width: '50px', height: '50px' }} />
                    <div>
                        <h6 className="mb-0">New Assignment Posted</h6>
                        <small className="text-muted">10 minutes ago</small>
                    </div>
                </li>
                <li className="dropdown-item d-flex align-items-start">
                    <img src="https://via.placeholder.com/50" alt="Notification 2" className="rounded me-2" style={{ width: '50px', height: '50px' }} />
                    <div>
                        <h6 className="mb-0">Course Updated</h6>
                        <small className="text-muted">30 minutes ago</small>
                    </div>
                </li>
            </ul>
        </div>
    );
};
