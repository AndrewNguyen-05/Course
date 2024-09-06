import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const Authorization = ({children, requiredRole }) => {

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true); // kiểm soát quá trình kiểm tra role
    const [isAuthorized, setIsAuthorized] = useState(false); // kiểm soát quá trình authorization

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    useEffect(() => {
        if(! token){
            navigate('/login');
            return;
        }
        if(role){
            if(role === requiredRole){
                setIsAuthorized(true);
                setIsLoading(false);
            } else {
                navigate('/accessdenied')
            }
            // Kiểm tra thêm như khi login google, hoặc 1 số trường hợp sẽ không lưu role trên UI
        } else {

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
                        throw new Error(errorData.message || 'An error occurred.');
                    });
                }
                return response.json();
            })
            .then(data => {
                if (data.result && data.result.valid) {
                    const userRole = data.result.scope; 
                    localStorage.setItem('role', userRole);
                    if (userRole === requiredRole) {
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
                setIsLoading(false); // Kết thúc trạng thái tải
            });
        }
    }, [navigate, token, requiredRole, role]);

    if (isLoading) {
        return <div>Loading...</div>; // isLoading === true =>  khi đang kiểm tra quyền 
    }

    if (!isAuthorized) {
        return null; // isAuthorized === false => không đủ quyền
    }

    return children; // Render nội dung con nếu người dùng được phép truy cập
};