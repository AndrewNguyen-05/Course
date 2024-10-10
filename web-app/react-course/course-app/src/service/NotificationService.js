import { fetchApi } from "../components/utils/api-utils";

export const notificationCurrentLogin = async (token) => {
    const response = await fetchApi(`http://localhost:8080/api/v1/notification-current`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if (!response.ok) throw new Error('Fail to get Notification')
    return response.json();
}

export const markAsReadNotification = async (token, notificationId) => {
    const response = await fetchApi(`http://localhost:8080/api/v1/is-read/${notificationId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error('Fail to markAsRead Notification')
    }

    return response.json();
}