export const getAllCourses = async (currentPage, pageSize) => {

    const response = await fetch(`http://localhost:8080/api/v1/courses?page=${currentPage}&size=${pageSize}`, {
        method: 'GET'
    })

    if (!response.ok) throw new Error(`${response.status}`);

    return response.json();
}

export const SearchService = async (currentPage, pageSize, filterQuery) => {
    try {
        let apiUrl = `http://localhost:8080/api/v1/courses?page=${currentPage}&size=${pageSize}`;
        if (filterQuery) {
            apiUrl += `&filter=${encodeURIComponent(filterQuery)}`;
            console.log("Filter Query:", filterQuery);
            console.log("API URL:", apiUrl);
        }

        const response = await fetch(apiUrl, { method: 'GET' });
        if (!response.ok) {
            throw new Error(`${response.status}`);
        }

        const result = await response.json();
        return result.result;
    } catch (error) {
        console.error('Error fetching courses:', error);
        throw error;
    }
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

export const buyCourse = async (token, id) => {
    const response = await fetch(`http://localhost:8080/api/v1/buy-course`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(id)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }

    return response.json();
};


