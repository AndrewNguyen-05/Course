import { toast } from "react-toastify";

export const getFavorite = async (currentPage, token) => {
    const response = await fetch(`http://localhost:8080/api/v1/fetch-all-favorites?page=${currentPage}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error fetching data');
    }
    return response.json();
}

export const addFavorite = async (token, courseId) => {
    const response = await fetch(`http://localhost:8080/api/v1/save-favorite?id=${courseId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    })

    if (!response.ok) throw new Error('Failed to add to favorites');

    return response.json();
}

export const removeFavorite = async (token, favoriteId) => {
    const response = await fetch(`http://localhost:8080/api/v1/delete-favorite/${favoriteId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        toast.error('Delete Favorite Failed!');
        throw new Error('Failed to remove Favorite' || errorData.message);
    }

    return response.json();
};


