import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdErrorOutline } from 'react-icons/md'; 

export const Accessdenied = () => {
    const [countdown, setCountdown] = useState(10); // Đếm ngược từ 10 giây
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(prevCountdown => {
                if (prevCountdown <= 1) {
                    clearInterval(interval);
                    navigate('/home'); 
                }
                return prevCountdown - 1;
            });
        }, 1000); // Cập nhật mỗi giây

        return () => clearInterval(interval); 
    }, [navigate]);

    return (
        <div className="forbidden-container">
            <MdErrorOutline className="forbidden-icon" size={60} />
            <h1 className="forbidden-title">403</h1>
            <h2 className="forbidden-message">Forbidden - You don't have permission to access this page.</h2>
            <p className="forbidden-description">
                Sorry, it seems like you are not allowed to view this content. Please contact the administrator if you believe this is a mistake.
            </p>
            <p className="countdown-text">You will be redirected to the homepage in {countdown} seconds...</p>
            <Link to='/' className="go-back-button">
                Go Back to Home
            </Link>
        </div>
    );
};
