export const getCommentByPostId = async (token, postId, currentPage) => {
    const response = await fetch(`http://localhost:8080/api/v1/post-comment/${postId}?page=${currentPage}`, { 
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

    const response = await fetch(`http://localhost:8080/api/v1/post-comment/add-comment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(commentData)
    })

    if (!response.ok) {
        const dataError = await response.json();
        throw new Error('Fail to AddComment', dataError.message)
    }

    return response.json();

}