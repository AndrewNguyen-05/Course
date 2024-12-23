import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const LoadingSpinner = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );

export const Authorization = ({ children, requiredRole }) => {

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true); 
    const [isAuthorized, setIsAuthorized] = useState(false); // kiểm soát quá trình authorization

    const token = localStorage.getItem('token'); 

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

        fetch('http://localhost:8080/api/v1/auth/introspect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ token })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.message);
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.result && data.result.valid) {
                const userRole = data.result.scope; 
                if (roles.includes(userRole)) {
                    setIsAuthorized(true);
                } else {
                    navigate('/accessdenied'); 
                }
            } else {
                throw new Error('Invalid token.');
            }
        })
        .catch(error => {
            console.error('Error during introspect:', error);
            navigate('/login');
        })
        .finally(() => {
            setIsLoading(false); // Kết thúc trạng thái kiem tra
        });

    }, [navigate, token, requiredRole]);

    if (isLoading) {
       return <LoadingSpinner />;
    }

    if (!isAuthorized) {
        return null; 
    }

    return children; // Nếu người dùng được phân quyền, render nội dung bên trong
};
