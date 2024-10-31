import axios from "../utils/CustomizeAxios";

export const fetchInfoTeacher = async (courseId) => {
  const response = await axios.get(`api/v1/info-teacher/${courseId}`);
  console.log(response.data);
  return response.data;
};
