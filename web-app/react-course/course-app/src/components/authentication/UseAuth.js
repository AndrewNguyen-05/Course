import React from "react";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const UseAuth = () => {
    const [isTokenValid, setIsTokenValid] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            setIsTokenValid(false);
            return;
        }

        fetch(`http://localhost:8080/api/v1/auth/introspect`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ token })
        }).then((response) => response.json()

        ).then(data => {
            console.log('API Response: ', data)
            setIsTokenValid(data.result.valid);
        }).catch(error => {
            console.error('Error checking token:', error);
            setIsTokenValid(false);
        });

    }, [token]);

    const handleLogout = () =>{
        if(!token){
            setIsTokenValid(false);
            return;
        }

        fetch(`http://localhost:8080/api/v1/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({token})
        }).then((response) => {
            if(response.ok){
                localStorage.clear();
                setIsTokenValid(false);
                navigate('/login')
            } else {
                console.log('Logout Fail ', response.statusText)
            }
            response.json();
        }).catch(error =>{
            console.log(error)
        })
    }
    
    return { isTokenValid, handleLogout };

}