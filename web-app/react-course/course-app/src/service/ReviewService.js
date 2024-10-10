import { toast } from 'react-toastify';
import { fetchApi } from '../components/utils/api-utils';

export const addReview = async (commentData, token, courseId) => {
    try {
        const response = await fetchApi(`http://localhost:8080/api/v1/add-review?id=${courseId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(commentData)
        });

        const data = await response.json();

        if (data.result) {
            toast.success('Comment added successfully');
            return data.result;
        } else {
            toast.error(data.message);
            throw new Error(data.message);
        }
    } catch (error) {
        throw error;
    }
};

export const addReplyReview = async (token, replyData, courseId) => {
    try {
        const response = await fetchApi(`http://localhost:8080/api/v1/add-review?id=${courseId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(replyData)
        });

        const data = await response.json();

        if (data.result) {
            toast.success('Reply added successfully');
            return data.result;
        } else {
            toast.error(data.message);
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error in service:', error);
        throw error;
    }
};

export const editReview = async (commentId, updatedContent, token) => {
    try {
        const response = await fetchApi(`http://localhost:8080/api/v1/update-review/${commentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ content: updatedContent })
        });

        const data = await response.json();

        if (data.result) {
            toast.success('Update Comment Successfully');
            return data.result;
        } else {
            toast.error(data.message);
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error in service:', error);
        throw error;
    }
};

export const deleteReview= async (commentId, token) => {
    try {
        const response = await fetchApi(`http://localhost:8080/api/v1/delete-review/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.result) {
            toast.success('Comment deleted successfully');
            return data.result;
        } else {
            toast.error(data.message);
            throw new Error(data.message);
        }
    } catch (error) {
        toast.error('Failed to delete comment');
        console.error('Error in service:', error);
        throw error;
    }
};


