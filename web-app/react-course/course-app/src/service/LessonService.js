import axios from "../utils/CustomizeAxios"

export const createLesson = async (lessonData) => {
    const response = await axios.post(`api/v1/create-lesson`, lessonData);
    console.log(response.data);

    return response.data;
}

export const deleteLesson = async (lessonId) => {
    const response = await axios.delete(`api/v1/delete-lesson/${lessonId}`);
    console.log(response.data);
    return response.data;
}