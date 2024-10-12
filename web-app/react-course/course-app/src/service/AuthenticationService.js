import { toast } from "react-toastify";
import axios from "../components/utils/CustomizeAxios";

export const login = async (email, password) => {
    try {
        const response = await axios.post(`api/v1/auth/token`, {
            email,
            password
        });
        if (response.data.code === 401) {
            toast.error('Email or Password incorrect');
            return;
        }
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
};

export const introspect = async (token) => {
    try {
        const response = await axios.post(`api/v1/auth/introspect`,
            { token },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }
        );

        if (response.data && response.data.result) {
            return response.data.result;
        } else {
            throw new Error('Invalid introspect response structure');
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to introspect token';
        throw new Error(errorMessage);
    }
};





