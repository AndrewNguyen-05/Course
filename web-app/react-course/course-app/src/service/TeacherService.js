import axios from "../utils/CustomizeAxios";

export const fetchInfoTeacher = async (courseId) => {
  const response = await axios.get(`api/v1/info-teacher/${courseId}`);
  return response.data;
};

export const fetchStudents = async (currentPage) => {
  const response = await axios.get(`api/v1/info-student`, {
    params: {
      page: currentPage,
    },
  });
  console.log(response.data);
  return response.data;
};
