import React, { useState, useEffect } from 'react';

export const UseAuth = ({ loggedOut }) => {
    const [isTokenValid, setIsTokenValid] = useState(null);

    const token = localStorage.getItem('token');
    const expiryTime = parseInt(localStorage.getItem('expiryTime'), 10);

    useEffect(() => {
        const checkToken = async () => {
            if (!token || isNaN(expiryTime) || loggedOut) {
                setIsTokenValid(false);
                return;
            }

            const now = new Date().getTime();
            const timeLeft = expiryTime - now;

            const oneHourInMs = 3600 * 1000;  // 1 hour in milliseconds

            if (timeLeft < oneHourInMs) {
                try {
                    const response = await fetch('http://localhost:8080/api/v1/auth/refresh', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ token: token })
                    });

                    if (!response.ok) throw new Error('Failed to refresh token');
                    
                    const data = await response.json();
                    const threeDaysInMs = 259200 * 1000;  // 3 days in milliseconds
                    const newExpiryTime = new Date().getTime() + threeDaysInMs;

                    localStorage.setItem('token', data.result.token);
                    localStorage.setItem('expiryTime', newExpiryTime.toString());

                    setIsTokenValid(true);
                } catch (error) {
                    console.error('Error refreshing token:', error);
                    setIsTokenValid(false);
                }
            } else {
                setIsTokenValid(true);
            }
        };

        checkToken();
    }, [token, expiryTime, loggedOut]);

    useEffect(() => {
        const introspectToken = async () => {
            // Nếu không có token hoặc đã đăng xuất, không thực hiện introspect nữa
            if (!token || loggedOut) {
                setIsTokenValid(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/api/v1/auth/introspect', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ token: token })
                });

                if (!response.ok) throw new Error('Token introspection failed');
                
                const data = await response.json();
                setIsTokenValid(data.result.valid);
            } catch (error) {
                console.error('Error introspecting token:', error);
                setIsTokenValid(false);
            }
        };

        introspectToken();
    }, [token, loggedOut]);

    return { isTokenValid };
};