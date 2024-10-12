import { toast } from 'react-toastify';
import axios from '../components/utils/CustomizeAxios';

export const addReview = async (courseId, commentData) => {
    try {
        const response = await axios.post(`api/v1/add-review`, commentData, {
            params: { id: courseId }
        });

        if (response.data && response.data.result) {
            toast.success('Comment added successfully');
            return response.data.result;
        } else {
            toast.error(response.data.message);
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error('Error adding review:', error);
        throw error;
    }
};


export const addReplyReview = async (courseId, replyData) => {
    try {
        const response = await axios.post(`api/v1/add-review`, replyData, {
            params: { id: courseId }
        });
        if (response.data.result) {
            toast.success('Reply added successfully');
            return response.data.result;
        } else {
            toast.error(response.data.message);
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error('Error in service:', error);
        throw error;
    }
};

export const editReview = async (commentId, updatedContent) => {
    try {
        const response = await axios.put(`api/v1/update-review/${commentId}`, { content: updatedContent })
        if (response.data.result) {
            toast.success('Update Comment Successfully');
            return response.data.result;
        } else {
            toast.error(response.data.message);
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error('Error in service:', error);
        throw error;
    }
};

export const deleteReview = async (commentId) => {
    try {
        const response = await axios.delete(`api/v1/delete-review/${commentId}`);
        if (response.data.result) {
            toast.success('Comment deleted successfully');
            return response.data.result;
        } else {
            toast.error(response.message);
            throw new Error(response.message);
        }
    } catch (error) {
        toast.error('Failed to delete comment');
        console.error('Error in service:', error);
        throw error;
    }
};


