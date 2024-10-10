import { toast } from "react-toastify";
import { fetchApi } from "../components/utils/api-utils";

export const getCommentByPostId = async (token, postId, currentPage) => {
    const response = await fetchApi(`http://localhost:8080/api/v1/post-comment/${postId}?page=${currentPage}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if (!response.ok) {
        const dataError = await response.json();
        throw new Error('Fail to getComment by PostId', dataError.message)
    }

    return response.json();
}

export const addComment = async (token, commentData) => {
    try {
        const response = await fetchApi(`http://localhost:8080/api/v1/add-comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(commentData)
        })

        const data = await response.json();

        if (data.result) {
            toast.success('Comment added successfully');
            return data.result;
        } else {
            toast.error(data.message);
            throw new Error(data.message);
        }
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export const replyComment = async (token, replyData) => {
    try {
        const response = await fetchApi(`http://localhost:8080/api/v1/add-comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(replyData)
        })
        const data = await response.json();

        console.log('Server Response:', data);
        if (data.result) {
            toast.success('Update Comment Successfull')
            return data.result;
        } else {
            toast.error(data.message)
            throw new Error(data.message);
        }

    } catch (error) {
        console.log(error)
        throw error;
    }
}

export const deleteComment = async (token, commentId) => {
    const response = await fetchApi(`http://localhost:8080/api/v1/delete-comment/${commentId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete comment');
    }

    return response.json();
}

export const updateComment = async (token, commentId, updateContent) => {

    try {
        const response = await fetchApi(`http://localhost:8080/api/v1/update-comment/${commentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ content: updateContent })
        })

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
}