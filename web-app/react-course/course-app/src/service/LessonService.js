import axios from "../utils/CustomizeAxios"

export const createLesson = async (lessonData) => {
    const response = await axios.post(`api/v1/create-lesson`, lessonData);
    return response.data;
}

export const deleteLesson = async (lessonId) => {
    const response = await axios.delete(`api/v1/delete-lesson/${lessonId}`);
    return response.data;
}

export const updateLesson = async (lessonData) => {
    const response = await axios.put(`api/v1/update-lesson`, lessonData);
    return response.data;
}