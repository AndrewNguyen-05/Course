import { toast } from "react-toastify";

export const login = async (email, password) => {
    const response = await fetch(`http://localhost:8080/api/v1/auth/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
        toast.error('Email or Password incorrect');
        const errorData = await response.json();
        throw new Error(errorData.message || 'An error occurred.');
    }

    return response.json();
};

export const introspect = async (token) => {
    const response = await fetch(`http://localhost:8080/api/v1/auth/introspect`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ token })
    })

    if(! response.ok){
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to introspect token');
    }

    return response.json();
}


