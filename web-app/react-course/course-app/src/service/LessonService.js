import axios from "../utils/CustomizeAxios"

export const createLesson = async (lessonData) => {
    const response = await axios.post(`api/v1/create-lesson`, lessonData);
    console.log(response.data);

    return response.data;
}