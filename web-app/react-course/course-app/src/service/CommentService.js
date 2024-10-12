import { toast } from "react-toastify";
import axios from "../components/utils/CustomizeAxios";

export const getCommentByPostId = async (postId, currentPage) => {
    try {
        const response = await axios.get(`api/v1/post-comment/${postId}`, {
            params: {
                page: currentPage
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching comments from API:', error.response || error.message);
        throw new Error(`Failed to fetch comments: ${error.response?.status || error.message}`);
    }
};


export const addComment = async (commentData) => {
    try {
        const response = await axios.post(`api/v1/add-comment`, commentData);
        console.log(response);
        if (response.data.result) {
            toast.success('Comment added successfully');
            return response.data.result;
        } else {
            toast.error(response.data.message);
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error('Error in addComment:', error);
        throw error;
    }
}

export const replyComment = async (replyData) => {
    try {
        const response = await axios.post(`api/v1/add-comment`, replyData)
        if (response.data.result) {
            toast.success('Comment added successfully')
            return response.data.result;
        } else {
            toast.error(response.data.message)
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export const deleteComment = async (commentId) => {
    try {
        const response = await axios.delete(`api/v1/delete-comment/${commentId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateComment = async (commentId, updateContent) => {
    try {
        const response = await axios.put(`api/v1/update-comment/${commentId}`, { content: updateContent })
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
}