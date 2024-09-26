export const getAllCourses = async (currentPage, pageSize) => {

    const response = await fetch(`http://localhost:8080/api/v1/courses?page=${currentPage}&size=${pageSize}`, {
        method: 'GET'
    })

    if (!response.ok) throw new Error(`${response.status}`);

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

export const getCourseById = async (id) => {

    const response = await fetch(`http://localhost:8080/api/v1/course/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (!response.ok) throw new Error('Course not existed')
    return response.json();

}

export const getCommentByCourseId = async (id) => {
    const response = await fetch(`http://localhost:8080/api/v1/courses-comment/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (!response.ok) throw new Error('Course not existed')

    return response.json();

}