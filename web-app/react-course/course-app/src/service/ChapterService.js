import axios from "../utils/CustomizeAxios";

export const createChapter = async (chapterData) => {
    const response = await axios.post(`api/v1/create/chapter`, chapterData);   
    console.log(response.data)
    return response.data;
}