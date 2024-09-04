import React from 'react';
import { useNavigate } from 'react-router-dom';

export const HandleLogout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        const token = localStorage.getItem('token'); // Lấy token từ localStorage

        if (!token) {
            console.log('No token found');
            return;
        }

        fetch('http://localhost:8080/api/v1/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ token })
        })
        .then(response => {
            if (response.ok) {
                localStorage.clear(); 
                navigate('/login');  
            } else {
                return response.json().then(err => {
                    console.log('Logout Failed: ', err.message || response.statusText);
                });
            }
        })
        .catch(error => {
            console.log('Logout error: ', error);
        });
    };

    return { handleLogout }; 
};
