import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../utils/LoadingSpinner";
import { introspect } from "../AuthenticationService";

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

         introspect()
        .then(data => {
            if (data && data.valid) {
                const userRole = data.scope; 
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
            setIsLoading(false);
        });

    }, [navigate, token, requiredRole]);

    if (isLoading) {
       return <LoadingSpinner />;
    }

    if (!isAuthorized) {
        return null; 
    }

    return children;
};
