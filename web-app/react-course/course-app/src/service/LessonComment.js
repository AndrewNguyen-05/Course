import axios from "../utils/CustomizeAxios";

export const addCommentLesson = async (commentLessonData) => {
    try {
        const response = await axios.post(`/api/v1/add-comment-lesson`, commentLessonData);
        return response.data;
    } catch (error) {
        console.error('Error in addCommentLesson:', error);
        throw error;
    }
};


export const getCommentLesson = async (lessonId) => {
    const response = await axios.get(`api/v1/get-comment-lesson/${lessonId}`);
    return response.data;
}