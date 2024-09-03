import React, { useEffect, useState } from "react";
import { Navigate } from 'react-router-dom';

export const PrivateRoute = ({ children }) => {
    
    const [isValidToken, setIsValidToken] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            setIsValidToken(false);
            return;
        }

        fetch(`http://localhost:8080/api/v1/auth/introspect`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ token }) // gửi token để kiểm tra
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.result.valid) {
                setIsValidToken(true);
            } else {
                setIsValidToken(false);
            }
        })
        .catch(() => {
            setIsValidToken(false);
        });
    }, [token]);

    if (isValidToken === null) {
        return <div></div>;
    }

    return isValidToken ? children : <Navigate to="/login" />;
};
