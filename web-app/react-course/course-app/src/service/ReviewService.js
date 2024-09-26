import { toast } from 'react-toastify';

export const addComment = async (commentData, token, courseId) => {
    try {
        const response = await fetch(`http://localhost:8080/api/v1/add-comment?id=${courseId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(commentData)
        });

        const data = await response.json();

        if (data.result) {
            console.log(data)
            console.log(data.result)
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

export const addReplyComment = async (replyData, token, courseId) => {
    try {
        const response = await fetch(`http://localhost:8080/api/v1/add-comment?id=${courseId}`, {
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

export const editComment = async (commentId, updatedContent, token) => {
    try {
        const response = await fetch(`http://localhost:8080/api/v1/update-comment/${commentId}`, {
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

export const deleteComment = async (commentId, token) => {
    try {
        const response = await fetch(`http://localhost:8080/api/v1/delete-comment/${commentId}`, {
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


