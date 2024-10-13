import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:8080/',
})

const refreshToken = async () => {
    try {
        const response = await instance.post('api/v1/auth/refresh', {
            token: localStorage.getItem('token')
        })
        console.log(response)
        if (response.status === 200) {
            const refreshToken = response.data.result.token;
            localStorage.setItem('token', refreshToken);
            return refreshToken;
        } else {
            throw new Error('Failed to refresh token');
        }
    } catch (error) {
        console.error("Error refreshing token: ", error);
        throw error;
    }
}

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && config.url !== 'api/v1/auth/refresh') {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return error && error.response && error.response ? error.response : Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
    return response;
},
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && error.response.data.message === 'EXPIRED_TOKEN' && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newToken = await refreshToken();
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                return instance(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }
        return error && error.response ? error.response : Promise.reject(error);
    }
)

export default instance;